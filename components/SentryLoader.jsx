const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const SentryLoader = () =>
  SENTRY_DSN && (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      src={`https://js.sentry-cdn.com/${SENTRY_DSN}.min.js`}
      crossOrigin='anonymous'
    />
  );
