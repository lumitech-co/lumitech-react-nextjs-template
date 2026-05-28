'use client';

import { useEffect } from 'react';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';

import { isActiveRunStatus, RunItemStatus } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { getApiBaseUrl, tokenStorage } from 'shared/lib';

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

  useEffect(() => {
    if (!runId || !runStatus || !isActiveRunStatus(runStatus)) {
      return undefined;
    }

    const abortController = new AbortController();
    const token = tokenStorage.get();
    const streamUrl = `${getApiBaseUrl()}/api/runs/${runId}/events`;

    const connectToStream = async () => {
      await fetchEventSource(streamUrl, {
        signal: abortController.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
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
  }, [runId, runStatus, queryClient]);
};
