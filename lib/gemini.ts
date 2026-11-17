import { GoogleGenAI } from '@google/genai';

// Parse all available API keys from environment
// Supports both GEMINI_API_KEYS (comma-separated) and GEMINI_API_KEY (single or comma-separated)
function getApiKeys(): string[] {
  // Check GEMINI_API_KEYS first (explicit multi-key variable)
  const multiKeys = process.env.GEMINI_API_KEYS;
  if (multiKeys) {
    const keys = multiKeys.split(',').map((k) => k.trim()).filter(Boolean);
    if (keys.length > 0) return keys;
  }

  // Also handle GEMINI_API_KEY with comma-separated values (user may have put all keys here)
  const singleKey = process.env.GEMINI_API_KEY;
  if (singleKey) {
    const keys = singleKey.split(',').map((k) => k.trim()).filter(Boolean);
    if (keys.length > 0) return keys;
  }

  return [];
}

let currentKeyIndex = 0;
const clientCache = new Map<string, GoogleGenAI>();

function getClientForKey(apiKey: string): GoogleGenAI {
  let client = clientCache.get(apiKey);
  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1beta',
    });
    clientCache.set(apiKey, client);
  }
  return client;
}

export function getGeminiClient(): GoogleGenAI {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check your environment variables.');
  }

  const activeKey = keys[currentKeyIndex % keys.length];
  return getClientForKey(activeKey);
}

// Fallback models in priority order: gemini-2.5-flash is lightning-fast (1.2s - 1.5s)
const MODEL_FALLBACK_CHAIN = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-3.8-flash',
];

export function getGeminiModel(): string {
  return MODEL_FALLBACK_CHAIN[0];
}

export function getGeminiTtsModel(): string {
  return process.env.GEMINI_TTS_MODEL || '';
}

/**
 * Execute an async operation with a strict timeout (e.g., 30s)
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  errorMsg = 'Operation timed out'
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

/**
 * Robust execution with Automatic Multi-Key Rotation and Model Failover.
 * If Key 1 fails (503, 429, 500), it rotates to Key 2.
 * If a model is experiencing high demand (503), it fails over to the next flash model.
 */
export async function executeWithFailover<T>(
  fn: (ai: GoogleGenAI, modelName: string) => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error('No GEMINI_API_KEY available.');
  }

  let lastError: unknown;

  // Try across available keys and models
  for (let k = 0; k < keys.length; k++) {
    const keyIndex = (currentKeyIndex + k) % keys.length;
    const apiKey = keys[keyIndex];
    const ai = getClientForKey(apiKey);

    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        const result = await withTimeout(fn(ai, model), timeoutMs, `Request to ${model} timed out`);
        // If successful, lock in this working key index
        currentKeyIndex = keyIndex;
        return result;
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[Failover] Key #${keyIndex + 1} with ${model} failed: ${errMsg}. Trying next...`);

        // If it's 503 high demand, 429 quota, or model unavailable (404), immediately try next model/key
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('404') ||
          errMsg.includes('not found') ||
          errMsg.includes('no longer available');

        if (!isTransient) {
          // If it's a fatal validation or syntax error, don't spin indefinitely
          break;
        }
      }
    }
  }

  throw lastError || new Error('All Gemini API keys and models failed. Please try again in a few moments.');
}

/**
 * Robust streaming execution with key rotation and failover.
 */
export async function executeStreamWithFailover<T>(
  fn: (ai: GoogleGenAI, modelName: string) => Promise<T>,
  timeoutMs: number = 25000
): Promise<T> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error('No GEMINI_API_KEY available.');
  }

  let lastError: unknown;

  for (let k = 0; k < keys.length; k++) {
    const keyIndex = (currentKeyIndex + k) % keys.length;
    const apiKey = keys[keyIndex];
    const ai = getClientForKey(apiKey);

    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        const result = await withTimeout(fn(ai, model), timeoutMs, `Stream connection to ${model} timed out`);
        currentKeyIndex = keyIndex;
        return result;
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[Failover Stream] Key #${keyIndex + 1} with ${model} failed: ${errMsg}. Trying next...`);

        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('404') ||
          errMsg.includes('not found') ||
          errMsg.includes('no longer available');

        if (!isTransient) {
          break;
        }
      }
    }
  }

  throw lastError || new Error('All Gemini API keys and models failed for streaming. Please try again in a moment.');
}
