import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBrain,
  FaCheckCircle,
  FaCloud,
  FaInfoCircle,
  FaPalette,
  FaSearch,
  FaUpload,
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import type { IconType } from 'react-icons';
import {
  analyzeImageFile,
  PALETTE_KEYS,
  PALETTE_META,
  type PaletteResult,
} from '../lib/colorAnalysis';
import {
  analyzeDrawing,
  type AnalysisSource,
  type AnalysisStage,
  type UrbanDrawResult,
} from '../lib/urbanDrawApi';

Chart.register(...registerables);

type ResultTab = 'detection' | 'palette' | 'interpretation';

const PROXY_URL =
  import.meta.env.VITE_ROBOFLOW_PROXY_URL || '/api/proxy-roboflow';

const STAGE_COPY: Record<AnalysisStage, string> = {
  roboflow:
    'Running the primary Roboflow workflow. A cold start can take up to two minutes…',
  fallback: 'Primary service unavailable. Switching to the reserve model…',
  'huggingface-upload': 'Preparing the drawing for the reserve model…',
  'huggingface-analysis':
    'The reserve model is analyzing the drawing. Free CPU inference may take a few minutes…',
};

const RESULT_TABS: Array<{
  value: ResultTab;
  label: string;
  icon: IconType;
}> = [
  { value: 'detection', label: 'Objects', icon: FaSearch },
  { value: 'palette', label: 'Palette', icon: FaPalette },
  { value: 'interpretation', label: 'Reading', icon: FaBrain },
];

const UrbanDrawingApp: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>('roboflow');
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<UrbanDrawResult | null>(null);
  const [palette, setPalette] = useState<PaletteResult | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('detection');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leadingColors = useMemo(() => {
    if (!palette) return [];
    return PALETTE_KEYS.filter((key) => palette.percentages[key] >= 0.5)
      .sort((a, b) => palette.percentages[b] - palette.percentages[a])
      .slice(0, 5);
  }, [palette]);

  useEffect(
    () => () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
      chartInstanceRef.current?.destroy();
    },
    [],
  );

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    const onMouseDown = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (activeTab !== 'palette' || !palette || !chartRef.current) return;
    chartInstanceRef.current?.destroy();
    const visibleColors = PALETTE_KEYS.filter(
      (key) => palette.percentages[key] >= 0.35,
    ).sort((a, b) => palette.percentages[b] - palette.percentages[a]);
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: visibleColors.map((key) => PALETTE_META[key].label),
        datasets: [
          {
            data: visibleColors.map((key) => palette.percentages[key]),
            backgroundColor: visibleColors.map(
              (key) => PALETTE_META[key].hex,
            ),
            borderWidth: 0,
            borderRadius: 7,
            barThickness: 18,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${Number(context.parsed.x).toFixed(1)}% of marked pixels`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: 50,
            grid: { color: 'rgba(148, 163, 184, 0.16)' },
            ticks: {
              callback: (value) => `${value}%`,
              color: '#64748b',
            },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#475569' },
          },
        },
      },
    });
  }, [activeTab, palette]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Choose an image smaller than 20 MB.');
      return;
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setResult(null);
    setPalette(null);
    setError(null);
    setActiveTab('detection');
    setIsProcessing(true);
    setStage('roboflow');

    const palettePromise = analyzeImageFile(file)
      .then((analysis) => {
        setPalette(analysis);
        return analysis;
      })
      .catch((colorError) => {
        console.warn('Local palette analysis failed.', colorError);
        return null;
      });

    try {
      const analysisResult = await analyzeDrawing(file, PROXY_URL, setStage);
      setResult(analysisResult);
    } catch (analysisError) {
      setError(
        'Both analysis services are temporarily unavailable. The local color palette is still shown below.',
      );
      console.error(analysisError);
      setActiveTab('palette');
    } finally {
      await palettePromise;
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDemoDrawing = async () => {
    setError(null);
    try {
      const response = await fetch('/images/drawing/test.jpeg');
      if (!response.ok) throw new Error('Demo drawing unavailable.');
      const blob = await response.blob();
      await processFile(
        new File([blob], 'urban-drawing-demo.jpeg', {
          type: blob.type || 'image/jpeg',
        }),
      );
    } catch {
      setError('The demo drawing could not be loaded.');
    }
  };

  const sourceLabel = (source: AnalysisSource) =>
    source === 'roboflow' ? 'Roboflow primary' : 'Hugging Face reserve';

  return (
    <div className="urban-draw-app">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">
            Live research prototype
          </p>
          <h2 className="mt-1 text-2xl font-display font-bold text-secondary-900 dark:text-white">
            Analyze a drawing
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-secondary-200 bg-secondary-50 px-3 py-1.5 text-xs text-secondary-600 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Primary + reserve routing
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-secondary-200 bg-secondary-50/70 hover:border-primary-300 dark:border-secondary-700 dark:bg-secondary-900/45'
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void processFile(file);
        }}
      >
        <input
          ref={fileInputRef}
          id="urban-drawing-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void processFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group mx-auto flex flex-col items-center rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary-600 shadow-sm ring-1 ring-secondary-200 transition-transform group-hover:-translate-y-0.5 dark:bg-secondary-800 dark:text-primary-400 dark:ring-secondary-700">
            <FaUpload className="h-5 w-5" />
          </span>
          <span className="mt-3 font-semibold text-secondary-900 dark:text-white">
            Drop a drawing or choose a file
          </span>
          <span className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
            JPG, PNG or WebP · up to 20 MB
          </span>
        </button>
        <button
          type="button"
          onClick={() => void handleDemoDrawing()}
          disabled={isProcessing}
          className="mt-3 text-sm font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-800 disabled:opacity-50 dark:text-primary-300"
        >
          Try the research sample instead
        </button>
      </div>

      {previewUrl && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-secondary-200 bg-white dark:border-secondary-700 dark:bg-secondary-900">
          <img
            src={previewUrl}
            alt="Uploaded children's drawing"
            className="h-44 w-full object-contain sm:h-52"
          />
        </div>
      )}

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/80 p-4 dark:border-primary-900 dark:bg-primary-900/20"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  {STAGE_COPY[stage]}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-secondary-600 dark:text-secondary-400">
                  Color analysis runs privately in this browser while the vision
                  service processes the drawing.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div
          className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {(result || palette) && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            {result && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900">
                <FaCheckCircle />
                {sourceLabel(result.source)}
              </span>
            )}
            {palette && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 font-medium text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:ring-violet-900">
                <FaPalette />
                Local calibrated palette
              </span>
            )}
          </div>

          <div
            className="grid grid-cols-3 gap-1 rounded-xl bg-secondary-100 p-1 dark:bg-secondary-900"
            role="tablist"
            aria-label="Drawing analysis results"
          >
            {RESULT_TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={String(value)}
                type="button"
                role="tab"
                aria-selected={activeTab === value}
                disabled={
                  (value === 'detection' && !result) ||
                  (value === 'palette' && !palette) ||
                  (value === 'interpretation' && !result)
                }
                onClick={() => setActiveTab(value)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  activeTab === value
                    ? 'bg-white text-secondary-900 shadow-sm dark:bg-secondary-800 dark:text-white'
                    : 'text-secondary-500 hover:text-secondary-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-secondary-400 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[290px] rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-secondary-700 dark:bg-secondary-800 sm:p-5">
            {activeTab === 'detection' && result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    Detected thematic elements
                  </h3>
                  {typeof result.detectionCount === 'number' && (
                    <span className="text-xs text-secondary-500">
                      {result.detectionCount} regions
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 block w-full overflow-hidden rounded-xl bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-900"
                  aria-label="View detected drawing at full size"
                >
                  <img
                    src={result.detectionImage}
                    alt="Drawing with detected thematic elements"
                    className="h-56 w-full object-contain transition-transform duration-300 hover:scale-[1.015]"
                  />
                </button>
                {result.categoryCounts &&
                  Object.keys(result.categoryCounts).length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {Object.entries(result.categoryCounts).map(
                        ([name, count]) => (
                          <div
                            key={name}
                            className="rounded-lg bg-secondary-50 px-3 py-2 dark:bg-secondary-900"
                          >
                            <p className="text-[11px] text-secondary-500">
                              {name}
                            </p>
                            <p className="mt-0.5 font-display text-lg font-bold text-secondary-900 dark:text-white">
                              {count}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                <p className="mt-3 text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">
                  Categories summarize Person, Built Environment,
                  Environmental, and Recreational elements. Detector errors
                  remain possible.
                </p>
              </motion.div>
            )}

            {activeTab === 'palette' && palette && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="font-semibold text-secondary-900 dark:text-white">
                  Marked-color distribution
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">
                  The estimator calibrates against the scanned paper and
                  excludes near-white background pixels.
                </p>
                <div className="mt-4 h-52">
                  <canvas ref={chartRef} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {leadingColors.map((key) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-secondary-200 px-2.5 py-1 text-xs text-secondary-700 dark:border-secondary-700 dark:text-secondary-300"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PALETTE_META[key].hex }}
                      />
                      {PALETTE_META[key].label}{' '}
                      {palette.percentages[key].toFixed(1)}%
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'interpretation' && result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <FaBrain />
                  </span>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      Exploratory urban reading
                    </h3>
                    <p className="text-[11px] text-secondary-500">
                      Generated by {sourceLabel(result.source)}
                    </p>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-2 border-primary-300 pl-4 text-[15px] leading-7 text-secondary-700 dark:border-primary-700 dark:text-secondary-200">
                  {result.interpretation}
                </blockquote>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary-50 p-3 text-xs leading-relaxed text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400">
                  <FaInfoCircle className="mt-0.5 shrink-0" />
                  This is a drawing-level, exploratory interpretation for
                  research and discussion—not a psychological diagnosis or an
                  assessment of an individual child.
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-secondary-100 pt-4 text-[10px] leading-tight text-secondary-500 dark:border-secondary-700 dark:text-secondary-400 sm:text-xs">
        <span className="flex items-center gap-1.5">
          <FaCloud className="text-primary-500" /> Roboflow primary
        </span>
        <span className="flex items-center gap-1.5">
          <FaSearch className="text-emerald-500" /> HF reserve
        </span>
        <span className="flex items-center gap-1.5">
          <FaPalette className="text-violet-500" /> Browser palette
        </span>
      </div>

      <AnimatePresence>
        {isModalOpen && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-secondary-950/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Detected drawing"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative max-h-[92vh] max-w-[94vw] overflow-auto rounded-2xl bg-white p-3 shadow-2xl dark:bg-secondary-800"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-secondary-950/75 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close full-size drawing"
              >
                <IoClose className="h-6 w-6" />
              </button>
              <img
                src={result.detectionImage}
                alt="Full-size drawing with detected thematic elements"
                className="max-h-[86vh] max-w-[88vw] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrbanDrawingApp;
