'use client';

import { useMemo, useState } from 'react';

import {
  DEFAULT_SCREENING,
  ITemplateField,
  MOCK_TEMPLATE_FIELDS,
} from 'shared/api';
import {
  CheckIcon,
  PlusIcon,
  RefreshIcon,
  SparkleIcon,
  TrashIcon,
  XIcon,
} from 'shared/icons';
import { Badge, useToast } from 'shared/ui';

const PROCESSED_COMPANIES = 44;
const RANGE_MIN = 50;
const RANGE_MAX = 100;

export const ExtractionFields = () => {
  const [fields, setFields] = useState<ITemplateField[]>(MOCK_TEMPLATE_FIELDS);
  const [selectedId, setSelectedId] = useState(MOCK_TEMPLATE_FIELDS[0]?.id);
  const [threshold, setThreshold] = useState(DEFAULT_SCREENING.threshold);
  const toast = useToast();

  const selected = fields.find(field => field.id === selectedId) ?? null;

  const grouped = useMemo(() => {
    const groups: Record<string, ITemplateField[]> = {};

    fields.forEach(field => {
      if (!groups[field.section]) {
        groups[field.section] = [];
      }

      groups[field.section]?.push(field);
    });

    return Object.entries(groups);
  }, [fields]);

  const updateField = (patch: Partial<ITemplateField>) => {
    setFields(current =>
      current.map(field =>
        field.id === selectedId ? { ...field, ...patch } : field,
      ),
    );
  };

  const addSynonym = (synonym: string) => {
    if (!selected) {
      return;
    }

    updateField({ synonyms: [...selected.synonyms, synonym] });
  };

  const removeSynonym = (synonym: string) => {
    if (!selected) {
      return;
    }

    updateField({
      synonyms: selected.synonyms.filter(existing => existing !== synonym),
    });
  };

  const handleSynonymKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    const value = event.currentTarget.value.trim();

    if (!value) {
      return;
    }

    addSynonym(value);
    event.currentTarget.value = '';
  };

  const updateRule = (index: number, value: string) => {
    if (!selected) {
      return;
    }

    const next = [...selected.rules];

    next[index] = value;
    updateField({ rules: next });
  };

  const deleteRule = (index: number) => {
    if (!selected) {
      return;
    }

    updateField({ rules: selected.rules.filter((_, idx) => idx !== index) });
  };

  const addRule = () => {
    if (!selected) {
      return;
    }

    updateField({ rules: [...selected.rules, ''] });
  };

  const rulesCount = selected?.rules.length ?? 0;

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Extraction Fields</div>
          <div className="page-sub">
            Add synonyms and AI hints to help extraction find values when
            reports use different terminology. Changes apply to new extractions
            only.
          </div>
        </div>
        <div className="page-actions">
          <Badge tone="info" withDot={false}>
            {fields.length} fields from template
          </Badge>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: '14px 16px' }}>
        <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="card-title">Low-confidence threshold</div>
            <div className="card-sub">
              Values extracted with AI confidence below this threshold are
              flagged as Low-confidence and added to the review queue.
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 240,
            }}
          >
            <input
              type="range"
              min={RANGE_MIN}
              max={RANGE_MAX}
              step="1"
              value={threshold}
              onChange={event => setThreshold(parseInt(event.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--accent)' }}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                minWidth: 50,
                textAlign: 'right',
              }}
            >
              {threshold}%
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          minHeight: 520,
        }}
      >
        {/* Left sidebar — field list */}
        <div
          style={{
            borderRight: '1px solid var(--line)',
            overflow: 'auto',
            maxHeight: 600,
          }}
        >
          {grouped.map(([section, items]) => (
            <div key={section}>
              <div
                className="sidebar-section"
                style={{
                  color: 'var(--ink-400)',
                  padding: '12px 16px 4px',
                  background: 'var(--surface-2)',
                }}
              >
                {section}
              </div>
              {items.map(field => (
                <div
                  key={field.id}
                  onClick={() => setSelectedId(field.id)}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderLeft:
                      selectedId === field.id
                        ? '3px solid var(--accent)'
                        : '3px solid transparent',
                    background:
                      selectedId === field.id
                        ? 'var(--accent-50)'
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {field.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                      {field.synonyms.length} synonym
                      {field.synonyms.length === 1 ? '' : 's'} &middot;{' '}
                      {field.rules.length} rule
                      {field.rules.length === 1 ? '' : 's'}
                      {field.hint ? ' \u00B7 hint' : ''}
                    </div>
                  </div>
                  {field.hint && (
                    <SparkleIcon
                      width={12}
                      height={12}
                      style={{ color: 'var(--accent)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right detail panel */}
        <div style={{ padding: 24, overflow: 'auto' }}>
          {selected && (
            <div className="col gap-20">
              <div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--ink-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                  }}
                >
                  {selected.section}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginTop: 4,
                  }}
                >
                  {selected.label}
                </div>
              </div>

              <div className="field">
                <label className="label">Synonyms / alternative wording</label>
                <div className="hint">
                  Terms that the AI should treat as equivalent to &ldquo;
                  {selected.label}&rdquo;.
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    padding: 8,
                    border: '1px solid var(--line-strong)',
                    borderRadius: 6,
                    minHeight: 42,
                    background: '#fff',
                  }}
                >
                  {selected.synonyms.map(synonym => (
                    <span
                      key={synonym}
                      className="badge badge-accent"
                      style={{ padding: '3px 6px 3px 10px', gap: 6 }}
                    >
                      {synonym}
                      <button
                        type="button"
                        onClick={() => removeSynonym(synonym)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'inherit',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                        aria-label={`Remove synonym ${synonym}`}
                      >
                        <XIcon width={10} height={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    className="input"
                    style={{
                      border: 'none',
                      flex: 1,
                      minWidth: 120,
                      height: 24,
                      padding: 0,
                      background: 'transparent',
                    }}
                    placeholder="Add synonym + Enter"
                    onKeyDown={handleSynonymKeyDown}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">AI hint</label>
                <div className="hint">
                  Free-text instruction for the AI when extracting this field.
                  E.g. preferred definition, treatment of adjustments, scope.
                </div>
                <textarea
                  className="textarea"
                  value={selected.hint}
                  onChange={event => updateField({ hint: event.target.value })}
                  placeholder="e.g. Prefer reported figures over adjusted unless only adjusted is available."
                />
              </div>

              <div className="field">
                <label className="label">Validation rules</label>
                <div className="hint">
                  Checks applied during and after extraction. Used for outlier
                  flagging and source guidance. Empty rules are ignored.
                </div>
                <div
                  style={{
                    padding: 8,
                    background: 'var(--surface-2)',
                    borderRadius: 6,
                    border: '1px solid var(--line)',
                  }}
                >
                  {rulesCount === 0 && (
                    <div
                      style={{
                        padding: '8px 6px',
                        fontSize: 12,
                        color: 'var(--ink-400)',
                        fontStyle: 'italic',
                      }}
                    >
                      No validation rules defined for this field yet.
                    </div>
                  )}
                  {/* eslint-disable react/no-array-index-key */}
                  {selected.rules.map((rule, ruleIndex) => (
                    <div
                      key={`rule-${selectedId}-${ruleIndex}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 6,
                        padding: '6px 0',
                        borderBottom:
                          ruleIndex < rulesCount - 1
                            ? '1px solid var(--line)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--ink-400)',
                          minWidth: 18,
                          paddingTop: 8,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {ruleIndex + 1}.
                      </div>
                      <textarea
                        className="textarea"
                        value={rule}
                        rows={2}
                        style={{
                          flex: 1,
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          minHeight: 38,
                          padding: '6px 10px',
                        }}
                        onChange={event =>
                          updateRule(ruleIndex, event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost"
                        title="Delete rule"
                        aria-label="Delete rule"
                        style={{
                          height: 30,
                          width: 30,
                          color: 'var(--danger)',
                        }}
                        onClick={() => deleteRule(ruleIndex)}
                      >
                        <TrashIcon width={13} height={13} />
                      </button>
                    </div>
                  ))}
                  {/* eslint-enable react/no-array-index-key */}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 8, color: 'var(--accent)' }}
                    onClick={addRule}
                  >
                    <PlusIcon width={12} height={12} />
                    Add rule
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    toast(
                      `Re-extraction queued for all ${PROCESSED_COMPANIES} processed companies \u00B7 using current parameters`,
                      { tone: 'success' },
                    )
                  }
                >
                  <RefreshIcon width={13} height={13} />
                  Re-extract all companies
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    toast('Saved \u00B7 applies to next extraction', {
                      tone: 'success',
                    })
                  }
                >
                  <CheckIcon width={13} height={13} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
