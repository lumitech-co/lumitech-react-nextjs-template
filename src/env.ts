import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const resolveApiUpstreamUrl = (): string | undefined => {
  if (process.env.API_UPSTREAM_URL) {
    return process.env.API_UPSTREAM_URL;
  }

  const legacyUrl = process.env.NEXT_PUBLIC_API_URL;

  if (legacyUrl?.startsWith('http')) {
    return legacyUrl;
  }

  return undefined;
};

const env = createEnv({
  server: {
    API_UPSTREAM_URL: z.string().url(),
  },
  runtimeEnv: {
    API_UPSTREAM_URL: resolveApiUpstreamUrl(),
  },
});

export { env };
