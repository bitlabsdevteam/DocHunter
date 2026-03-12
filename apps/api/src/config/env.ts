import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  DEFAULT_MODEL_PROVIDER: z.enum(['openai', 'gemini']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-5.4'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-pro'),

  RESEARCH_ENGINE: z.enum(['perplexity']).default('perplexity'),
  PERPLEXITY_API_KEY: z.string().optional(),

  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().optional(),

  VERCEL_API_KEY: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  VERCEL_TEAM_ID: z.string().optional(),

  MCP_DIRECTORY_SERVER_URL: z.string().optional(),
  MCP_BOOKING_SERVER_URL: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);

export function assertRuntimeReadiness() {
  const issues: string[] = [];

  if (env.DEFAULT_MODEL_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
    issues.push('OPENAI_API_KEY missing while DEFAULT_MODEL_PROVIDER=openai');
  }

  if (env.DEFAULT_MODEL_PROVIDER === 'gemini' && !env.GEMINI_API_KEY) {
    issues.push('GEMINI_API_KEY missing while DEFAULT_MODEL_PROVIDER=gemini');
  }

  if (!env.PERPLEXITY_API_KEY) {
    issues.push('PERPLEXITY_API_KEY missing (required for clinic discovery research).');
  }

  return issues;
}
