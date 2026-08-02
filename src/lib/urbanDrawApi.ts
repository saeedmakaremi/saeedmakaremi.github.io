export type AnalysisSource = 'roboflow' | 'huggingface';

export interface UrbanDrawResult {
  source: AnalysisSource;
  detectionImage: string;
  interpretation: string;
  detectionCount?: number;
  categoryCounts?: Record<string, number>;
  structuredAnalysis?: Record<string, unknown>;
}

export type AnalysisStage =
  | 'roboflow'
  | 'fallback'
  | 'huggingface-upload'
  | 'huggingface-analysis';

const HF_SPACE =
  import.meta.env.VITE_HF_SPACE_URL ||
  'https://sdmac-urban-draw-detection.hf.space';

const withTimeout = (milliseconds: number): {
  controller: AbortController;
  clear: () => void;
} => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), milliseconds);
  return {
    controller,
    clear: () => window.clearTimeout(timeoutId),
  };
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const fetchWithRetry = async (
  input: RequestInfo | URL,
  createInit: (signal: AbortSignal) => RequestInit,
  options: { attempts: number; timeout: number },
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    const timeout = withTimeout(options.timeout);
    try {
      const response = await fetch(
        input,
        createInit(timeout.controller.signal),
      );
      if (response.ok || response.status < 500 || attempt === options.attempts) {
        return response;
      }
      lastError = new Error(`Temporary service error ${response.status}.`);
    } catch (error) {
      lastError = error;
      if (attempt === options.attempts) throw error;
    } finally {
      timeout.clear();
    }

    await wait(1_500 * attempt);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('The remote service could not be reached.');
};

const asDataUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (
    value.startsWith('data:') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }
  return `data:image/jpeg;base64,${value}`;
};

const cleanInterpretation = (value: string): string => {
  let text = value
    .replace(
      /\s*This drawing-level interpretation is exploratory and not diagnostic\.?/gi,
      '',
    )
    .trim();

  // Some free inference endpoints stop exactly at their token limit. Avoid
  // presenting a visibly severed clause and close with a useful design prompt.
  if (text && !/[.!?]["')\]]?$/.test(text)) {
    const lastCompleteSentence = Math.max(
      text.lastIndexOf('.'),
      text.lastIndexOf('!'),
      text.lastIndexOf('?'),
    );
    if (lastCompleteSentence > text.length * 0.45) {
      text = text.slice(0, lastCompleteSentence + 1);
    }
    text +=
      ' For child-friendly urban design, use these patterns as prompts for discussion about social space, nature, play, and built form rather than as fixed psychological conclusions.';
  }

  return text;
};

const normalizeRoboflow = (payload: unknown): UrbanDrawResult => {
  const root = payload as Record<string, unknown>;
  const candidates = Array.isArray(payload)
    ? payload
    : Array.isArray(root?.outputs)
      ? root.outputs
      : [payload];
  const first = (candidates[0] || {}) as Record<string, unknown>;
  const imageOutput = first.output as
    | string
    | { value?: unknown; url?: unknown }
    | undefined;
  const imageValue =
    typeof imageOutput === 'object' && imageOutput
      ? imageOutput.value || imageOutput.url
      : imageOutput;
  const openAi = first.open_ai as { output?: unknown } | undefined;
  const interpretation =
    typeof openAi?.output === 'string'
      ? cleanInterpretation(openAi.output)
      : '';
  const detectionImage = asDataUrl(imageValue);

  if (!detectionImage || !interpretation) {
    throw new Error('Roboflow returned an incomplete workflow result.');
  }

  return {
    source: 'roboflow',
    detectionImage,
    interpretation,
  };
};

const runRoboflow = async (
  file: File,
  proxyUrl: string,
): Promise<UrbanDrawResult> => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The drawing could not be read.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.split(',')[1] || '');
    };
    reader.readAsDataURL(file);
  });

  const response = await fetchWithRetry(
    proxyUrl,
    (signal) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: {
            type: 'base64',
            value: base64,
          },
        },
      }),
      signal,
    }),
    { attempts: 1, timeout: 75_000 },
  );

  if (!response.ok) {
    throw new Error(`Roboflow returned ${response.status}.`);
  }
  return normalizeRoboflow(await response.json());
};

const parseSseResult = async (
  response: Response,
): Promise<unknown[]> => {
  if (!response.ok || !response.body) {
    throw new Error('The Hugging Face result stream could not be opened.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let eventName = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (eventName === 'error') {
          throw new Error(data || 'The Hugging Face analysis failed.');
        }
        if (eventName === 'complete') {
          return JSON.parse(data) as unknown[];
        }
      }
    }
  }

  throw new Error('The Hugging Face analysis ended without a result.');
};

const runHuggingFace = async (
  file: File,
  onStage?: (stage: AnalysisStage) => void,
): Promise<UrbanDrawResult> => {
  onStage?.('huggingface-upload');
  const uploadResponse = await fetchWithRetry(
    `${HF_SPACE}/gradio_api/upload`,
    (signal) => {
      const uploadForm = new FormData();
      uploadForm.append('files', file, file.name);
      return { method: 'POST', body: uploadForm, signal };
    },
    { attempts: 2, timeout: 120_000 },
  );
  if (!uploadResponse.ok) {
    throw new Error('The drawing could not be uploaded to the reserve model.');
  }
  const uploadedPaths = (await uploadResponse.json()) as string[];
  const uploadedPath = uploadedPaths[0];
  if (!uploadedPath) throw new Error('The reserve model returned no upload path.');

  onStage?.('huggingface-analysis');
  const startResponse = await fetchWithRetry(
    `${HF_SPACE}/gradio_api/call/v2/analyze`,
    (signal) => ({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: {
          path: uploadedPath,
          orig_name: file.name,
          mime_type: file.type || 'image/jpeg',
          meta: { _type: 'gradio.FileData' },
        },
        confidence: 0.2,
      }),
      signal,
    }),
    { attempts: 2, timeout: 120_000 },
  );
  if (!startResponse.ok) {
    throw new Error('The reserve analysis could not be started.');
  }
  const { event_id: eventId } = (await startResponse.json()) as {
    event_id?: string;
  };
  if (!eventId) throw new Error('The reserve model returned no event ID.');

  const streamUrl = `${HF_SPACE}/gradio_api/call/analyze/${eventId}`;
  const queueDeadline = Date.now() + 8 * 60_000;
  let outputs: unknown[] | null = null;
  let streamError: unknown;

  // Gradio queues can briefly disconnect while a free Space wakes or while a
  // job is waiting. Reconnect to the same event instead of restarting it.
  for (let attempt = 1; attempt <= 3 && !outputs; attempt += 1) {
    const remaining = queueDeadline - Date.now();
    if (remaining <= 0) break;
    const streamTimeout = withTimeout(Math.min(remaining, 240_000));
    try {
      const streamResponse = await fetch(streamUrl, {
        signal: streamTimeout.controller.signal,
        headers: { Accept: 'text/event-stream' },
      });
      outputs = await parseSseResult(streamResponse);
    } catch (error) {
      streamError = error;
      if (attempt < 3 && Date.now() < queueDeadline) {
        await wait(2_000 * attempt);
      }
    } finally {
      streamTimeout.clear();
    }
  }

  if (!outputs) {
    throw streamError instanceof Error
      ? streamError
      : new Error('The reserve model queue exceeded eight minutes.');
  }
  const image = outputs[0] as { url?: string; path?: string } | undefined;
  const analysis = (outputs[2] || {}) as Record<string, unknown>;
  const interpretationData = analysis.interpretation as
    | { text?: string }
    | undefined;
  const rawInterpretation =
    (typeof outputs[3] === 'string' && outputs[3].trim()) ||
    interpretationData?.text?.trim() ||
    '';
  const interpretation = cleanInterpretation(rawInterpretation);
  const categorySummary = (analysis.category_summary || {}) as Record<
    string,
    { count?: number }
  >;
  const categoryCounts = Object.fromEntries(
    Object.entries(categorySummary).map(([name, value]) => [
      name,
      Number(value?.count || 0),
    ]),
  );
  const detectionImage =
    image?.url ||
    (image?.path
      ? `${HF_SPACE}/gradio_api/file=${encodeURI(image.path)}`
      : '');

  if (!detectionImage || !interpretation) {
    throw new Error('The reserve model returned an incomplete result.');
  }

  return {
    source: 'huggingface',
    detectionImage,
    interpretation,
    detectionCount: Number(analysis.detection_count || 0),
    categoryCounts,
    structuredAnalysis: analysis,
  };
};

export const analyzeDrawing = async (
  file: File,
  proxyUrl: string,
  onStage?: (stage: AnalysisStage) => void,
): Promise<UrbanDrawResult> => {
  try {
    onStage?.('roboflow');
    return await runRoboflow(file, proxyUrl);
  } catch (primaryError) {
    console.warn('Primary UrbanDraw service unavailable.', primaryError);
    onStage?.('fallback');
    return runHuggingFace(file, onStage);
  }
};
