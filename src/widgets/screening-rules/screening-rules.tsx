'use client';

import { useCallback, useState } from 'react';

// import { useGetLatestRun } from 'entities';

import { useStartRun } from 'features';
import {
  DEFAULT_SCREENING,
  // isActiveRunStatus,
  IScreeningRules,
  SUPERSECTORS,
} from 'shared/api';
import { CheckIcon, PlayIcon } from 'shared/icons';
import { Badge, Checkbox, useToast } from 'shared/ui';

export const ScreeningRules = () => {
  const toast = useToast();
  const [rules, setRules] = useState<IScreeningRules>(DEFAULT_SCREENING);
  const [draft, setDraft] = useState<IScreeningRules>(DEFAULT_SCREENING);
  // const { data: latestRunResponse } = useGetLatestRun();
  // const activeRun = latestRunResponse?.data ?? null;
  const { startRun, isStarting } = useStartRun();
  const dirty = JSON.stringify(draft) !== JSON.stringify(rules);
  // const isRunInProgress = activeRun
  //   ? isActiveRunStatus(activeRun.status)
  //   : false;

  const toggle = useCallback((sector: string) => {
    setDraft(prev => ({
      ...prev,
      excludedSectors: prev.excludedSectors.includes(sector)
        ? prev.excludedSectors.filter(existing => existing !== sector)
        : [...prev.excludedSectors, sector],
    }));
  }, []);

  const save = useCallback(() => {
    setRules(draft);
    toast('Screening rules saved · applied on next run', { tone: 'success' });
  }, [draft, toast]);

  const handleStartRun = useCallback(async () => {
    await startRun(draft);
  }, [draft, startRun]);

  // const handleCancel = useCallback(() => {
  //   toast('Cancel run is not yet available', { tone: 'default' });
  // }, [toast]);

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Screening Rules</div>
          <div className="page-sub">
            Configure sector exclusions and the market cap threshold. Changes
            take effect on the next run.
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!dirty}
            onClick={save}
          >
            <CheckIcon width={13} height={13} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Excluded supersectors</div>
              <div className="card-sub">
                Companies whose supersector matches will be removed from the
                shortlist.
              </div>
            </div>
            <div className="spacer" />
            <Badge tone="neutral" withDot={false}>
              {draft.excludedSectors.length} excluded
            </Badge>
          </div>
          <div
            className="card-body"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
            }}
          >
            {SUPERSECTORS.map(sector => (
              <label
                key={sector}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                <Checkbox
                  checked={draft.excludedSectors.includes(sector)}
                  onChange={() => toggle(sector)}
                />
                <span style={{ fontSize: 13 }}>{sector}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col gap-16">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Market cap threshold</div>
            </div>
            <div className="card-body">
              <div className="hint" style={{ marginBottom: 14 }}>
                Companies below this market cap (in GBP) will be excluded.
                Reuters values are converted using the previous business
                day&apos;s ECB reference rate.
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                  }}
                >
                  £{draft.minMcap.toFixed(1)}
                </span>
                <span style={{ fontSize: 14, color: 'var(--ink-500)' }}>
                  bn minimum
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={draft.minMcap}
                onChange={event =>
                  setDraft({
                    ...draft,
                    minMcap: parseFloat(event.target.value),
                  })
                }
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--ink-500)',
                  marginTop: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span>£0bn</span>
                <span>£100bn</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Run controls</div>
            </div>
            <div className="card-body">
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--ink-500)',
                  marginBottom: 12,
                }}
              >
                Only one run can be active at a time. Cancelling stops
                processing further companies but preserves work already
                completed.
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={isStarting}
                onClick={handleStartRun}
              >
                <PlayIcon width={14} height={14} />
                Start New Run
              </button>
              {/* {isRunInProgress ? (
                <div className="col gap-8">
                  <div
                    className="badge badge-info"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <span className="badge-dot" />
                    Running
                    {activeRun?.label ? ` · ${activeRun.label}` : ''}
                  </div>
                  <div className="row gap-8">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled
                      style={{ flex: 1 }}
                    >
                      <RefreshIcon width={13} height={13} className="spin" />
                      Running
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      <StopIcon width={13} height={13} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={isStarting}
                  onClick={handleStartRun}
                >
                  <PlayIcon width={14} height={14} />
                  Start New Run
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
