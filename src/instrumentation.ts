import * as Sentry from '@sentry/nextjs';


export async function register() {
  if(process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Set environment
      environment: process.env.NODE_ENV,

      // Set release version
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
