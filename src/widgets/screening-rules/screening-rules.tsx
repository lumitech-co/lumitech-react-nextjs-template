'use client';

import { Controller } from 'react-hook-form';

import { useScreeningRules } from 'features';
import { SUPERSECTORS } from 'shared/api';
import { CheckIcon, PlayIcon } from 'shared/icons';
import { Badge, Checkbox } from 'shared/ui';

const LOADING_OPACITY = 0.6;

export const ScreeningRules = () => {
  const { form, onSave, onStartRun, toggle, isSaving, isStarting, isLoading } =
    useScreeningRules();
  const {
    control,
    watch,
    formState: { isDirty },
  } = form;
  const excludedSectors = watch('excludedSectors');

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
            disabled={!isDirty || isSaving || isLoading}
            onClick={onSave}
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
              {excludedSectors.length} excluded
            </Badge>
          </div>
          <div
            className="card-body"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
              opacity: isLoading ? LOADING_OPACITY : 1,
              pointerEvents: isLoading ? 'none' : 'auto',
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
                  checked={excludedSectors.includes(sector)}
                  disabled={isLoading}
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
            <div
              className="card-body"
              style={{
                opacity: isLoading ? LOADING_OPACITY : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
              }}
            >
              <div className="hint" style={{ marginBottom: 14 }}>
                Companies outside this market cap range (in GBP) will be
                excluded. Reuters values are converted using the previous
                business day&apos;s ECB reference rate. Leave Max empty to apply
                no upper limit.
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="label">Min market cap (£bn)</div>
                  <Controller
                    control={control}
                    name="minMcap"
                    render={({ field }) => (
                      <input
                        type="number"
                        className="input"
                        min="0"
                        step="0.1"
                        value={field.value ?? ''}
                        disabled={isLoading}
                        onChange={event =>
                          field.onChange(
                            event.target.value === ''
                              ? null
                              : parseFloat(event.target.value),
                          )
                        }
                        placeholder="e.g. 2"
                      />
                    )}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">Max market cap (£bn)</div>
                  <Controller
                    control={control}
                    name="maxMcap"
                    render={({ field }) => (
                      <input
                        type="number"
                        className="input"
                        min="0"
                        step="0.1"
                        value={field.value ?? ''}
                        disabled={isLoading}
                        onChange={event =>
                          field.onChange(
                            event.target.value === ''
                              ? null
                              : parseFloat(event.target.value),
                          )
                        }
                        placeholder="No upper limit"
                      />
                    )}
                  />
                </div>
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
                disabled={isStarting || isLoading}
                onClick={onStartRun}
              >
                <PlayIcon width={14} height={14} />
                Start New Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
