'use client';

import { useEffect, useState } from 'react';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';

import { authApi, isActiveRunStatus, RunItemStatus } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { getApiBaseUrl, tokenStorage } from 'shared/lib';

class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

const invalidateRunQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  runId: string,
) => {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.RUN_LATEST] });
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.RUN_STATS, runId],
  });
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.RUN_ACTIVITIES, runId],
  });
};

export const useStreamRunEvents = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) => {
  const queryClient = useQueryClient();
  const [reconnectKey, setReconnectKey] = useState(0);

  useEffect(() => {
    if (!runId || !runStatus || !isActiveRunStatus(runStatus)) {
      return undefined;
    }

    const abortController = new AbortController();
    const streamUrl = `${getApiBaseUrl()}/api/runs/${runId}/events`;

    const connectToStream = async () => {
      const token = tokenStorage.get();

      await fetchEventSource(streamUrl, {
        signal: abortController.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        onopen: response => {
          if (response.status === 401) {
            throw new UnauthorizedError();
          }

          if (!response.ok) {
            throw new Error(`SSE ${response.status}`);
          }

          return Promise.resolve();
        },
        onerror: error => {
          if (error instanceof UnauthorizedError) {
            authApi
              .refresh()
              .then(response => {
                tokenStorage.set(response.data.accessToken);
                setReconnectKey(previousKey => previousKey + 1);
              })
              .catch(() => {
                // Redirect is handled by the axios response interceptor.
              });
          }

          throw error;
        },
        onmessage: messageEvent => {
          if (!messageEvent.data) {
            return;
          }

          try {
            JSON.parse(messageEvent.data);
            invalidateRunQueries(queryClient, runId);
          } catch {
            // Ignore malformed SSE frames.
          }
        },
      });
    };

    connectToStream().catch(() => {
      // fetchEventSource retries until the abort signal fires.
    });

    return () => {
      abortController.abort();
    };
  }, [runId, runStatus, queryClient, reconnectKey]);
};
