import { env } from '../config/env.js';
import type { ModelProvider } from '../types/domain.js';

export function resolveModelProvider(preferred?: ModelProvider): ModelProvider {
  return preferred ?? env.DEFAULT_MODEL_PROVIDER;
}

export function resolveModelName(provider: ModelProvider): string {
  if (provider === 'openai') return env.OPENAI_MODEL;
  return env.GEMINI_MODEL;
}
