import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from '@tanstack/react-query';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * HOUR,
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state?.status === 'pending',
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

/**
 * A fresh client per server render — a shared one would leak one request's
 * cache into the next. In the browser the client is reused so that React
 * suspense re-renders don't throw away the cache.
 */
export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};
