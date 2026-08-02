export const PALETTE_KEYS = [
  'black',
  'gray',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];

export interface PaletteResult {
  counts: Record<PaletteKey, number>;
  percentages: Record<PaletteKey, number>;
  markedPixelCount: number;
  sampledPixelCount: number;
  paperRgb: [number, number, number];
}

export const PALETTE_META: Record<
  PaletteKey,
  { label: string; hex: string }
> = {
  black: { label: 'Black', hex: '#18181b' },
  gray: { label: 'Gray', hex: '#94a3b8' },
  brown: { label: 'Brown', hex: '#92400e' },
  red: { label: 'Red', hex: '#ef4444' },
  orange: { label: 'Orange', hex: '#f97316' },
  yellow: { label: 'Yellow', hex: '#eab308' },
  green: { label: 'Green', hex: '#22c55e' },
  blue: { label: 'Blue', hex: '#3b82f6' },
  purple: { label: 'Purple', hex: '#8b5cf6' },
  pink: { label: 'Pink', hex: '#ec4899' },
};

const emptyCounts = (): Record<PaletteKey, number> =>
  Object.fromEntries(PALETTE_KEYS.map((key) => [key, 0])) as Record<
    PaletteKey,
    number
  >;

export const rgbToHsv = (
  red: number,
  green: number,
  blue: number,
): [number, number, number] => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  if (hue < 0) hue += 360;
  const saturation = max === 0 ? 0 : delta / max;
  return [hue, saturation, max];
};

const median = (values: number[]): number => {
  if (!values.length) return 255;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
};

const estimatePaperColor = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
): [number, number, number] => {
  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];
  const edgeDepth = Math.max(2, Math.floor(Math.min(width, height) * 0.04));
  const step = Math.max(1, Math.floor(Math.max(width, height) / 500));

  const addIfPaperCandidate = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const [, saturation, value] = rgbToHsv(r, g, b);
    if (value > 0.68 && saturation < 0.24) {
      reds.push(r);
      greens.push(g);
      blues.push(b);
    }
  };

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (
        x < edgeDepth ||
        x >= width - edgeDepth ||
        y < edgeDepth ||
        y >= height - edgeDepth
      ) {
        addIfPaperCandidate(x, y);
      }
    }
  }

  return [median(reds), median(greens), median(blues)];
};

const classifyPixel = (
  red: number,
  green: number,
  blue: number,
  paperRgb: [number, number, number],
): PaletteKey | null => {
  const [hue, saturation, value] = rgbToHsv(red, green, blue);
  const paperDistance = Math.sqrt(
    (red - paperRgb[0]) ** 2 +
      (green - paperRgb[1]) ** 2 +
      (blue - paperRgb[2]) ** 2,
  );

  // Scanner illumination makes paper slightly gray or blue. Compare with the
  // drawing's own border color instead of relying on a fixed white threshold.
  if (
    (value > 0.72 && saturation < 0.18 && paperDistance < 52) ||
    (value > 0.96 && saturation < 0.1)
  ) {
    return null;
  }

  if (value < 0.2) return 'black';
  if (saturation < 0.14) return value < 0.84 ? 'gray' : null;

  // Brown is a dark orange/yellow and must be identified before hue buckets.
  if (hue >= 12 && hue < 52 && value < 0.72 && saturation > 0.2) {
    return 'brown';
  }

  if (hue < 15 || hue >= 345) return 'red';
  if (hue < 42) return 'orange';
  if (hue < 70) return 'yellow';
  if (hue < 170) return 'green';
  if (hue < 255) return 'blue';
  if (hue < 300) return 'purple';
  return 'pink';
};

export const analyzeImageData = (
  imageData: ImageData,
): PaletteResult => {
  const { data, width, height } = imageData;
  const counts = emptyCounts();
  const paperRgb = estimatePaperColor(data, width, height);
  let markedPixelCount = 0;
  let sampledPixelCount = 0;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 128) continue;
    sampledPixelCount += 1;
    const color = classifyPixel(
      data[index],
      data[index + 1],
      data[index + 2],
      paperRgb,
    );
    if (!color) continue;
    counts[color] += 1;
    markedPixelCount += 1;
  }

  const percentages = Object.fromEntries(
    PALETTE_KEYS.map((key) => [
      key,
      markedPixelCount ? (counts[key] / markedPixelCount) * 100 : 0,
    ]),
  ) as Record<PaletteKey, number>;

  return {
    counts,
    percentages,
    markedPixelCount,
    sampledPixelCount,
    paperRgb,
  };
};

export const analyzeImageFile = async (file: File): Promise<PaletteResult> => {
  const bitmap = await createImageBitmap(file);
  const longestSide = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 720 / longestSide);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Color analysis is unavailable in this browser.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return analyzeImageData(context.getImageData(0, 0, width, height));
};
