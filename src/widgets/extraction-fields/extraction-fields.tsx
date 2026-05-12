'use client';

import { useMemo, useState } from 'react';

import {
  DEFAULT_SCREENING,
  ICompany,
  ITemplateField,
  MOCK_COMPANIES,
  MOCK_TEMPLATE_FIELDS,
} from 'shared/api';
import {
  CheckIcon,
  RefreshIcon,
  SearchIcon,
  SparkleIcon,
  XIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, Modal, useToast } from 'shared/ui';

const RANGE_MIN = 50;
const RANGE_MAX = 100;
const RULES_ROWS = 6;

export const ExtractionFields = () => {
  const [fields, setFields] = useState<ITemplateField[]>(MOCK_TEMPLATE_FIELDS);
  const [selectedId, setSelectedId] = useState(MOCK_TEMPLATE_FIELDS[0]?.id);
  const [threshold, setThreshold] = useState(DEFAULT_SCREENING.threshold);
  const [query, setQuery] = useState('');
  const [showReExtract, setShowReExtract] = useState(false);
  const [reExtractMode, setReExtractMode] = useState<'all' | 'selected'>('all');
  const [reExtractSelected, setReExtractSelected] = useState<
    Record<string, boolean>
  >({});
  const [reExtractQuery, setReExtractQuery] = useState('');
  const toast = useToast();

  const selected = fields.find(field => field.id === selectedId) ?? null;

  const filteredFields = useMemo(() => {
    if (!query.trim()) {
      return fields;
    }

    const lowerQuery = query.trim().toLowerCase();

    return fields.filter(field =>
      field.label.toLowerCase().includes(lowerQuery),
    );
  }, [fields, query]);

  const eligibleCompanies = useMemo(
    () =>
      MOCK_COMPANIES.filter(
        (company: ICompany) =>
          company.stage === 'done' || company.stage === 'review',
      ),
    [],
  );

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

  const closeReExtract = () => {
    setShowReExtract(false);
    setReExtractQuery('');
  };

  const handleReExtract = () => {
    if (reExtractMode === 'all') {
      toast(
        `Re-extraction queued for all ${eligibleCompanies.length} processed companies \u00B7 using current parameters`,
        { tone: 'success' },
      );
    } else {
      const selCount = Object.values(reExtractSelected).filter(Boolean).length;

      toast(
        `Re-extraction queued for ${selCount} compan${selCount === 1 ? 'y' : 'ies'} \u00B7 using current parameters`,
        { tone: 'success' },
      );
    }

    setShowReExtract(false);
    setReExtractSelected({});
    setReExtractQuery('');
  };

  const filteredEligible = useMemo(() => {
    if (!reExtractQuery.trim()) {
      return eligibleCompanies;
    }

    const lowerQuery = reExtractQuery.trim().toLowerCase();

    return eligibleCompanies.filter((company: ICompany) =>
      company.name.toLowerCase().includes(lowerQuery),
    );
  }, [eligibleCompanies, reExtractQuery]);

  const reExtractSelectedCount =
    Object.values(reExtractSelected).filter(Boolean).length;

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

      <div className="card mb-4 p-3.5 px-4">
        <div className="row flex-wrap gap-16">
          <div className="min-w-[280px] flex-1">
            <div className="card-title">Low-confidence threshold</div>
            <div className="card-sub">
              Values extracted with AI confidence below this threshold are
              flagged as Low-confidence and added to the review queue.
            </div>
          </div>
          <div className="flex min-w-[240px] items-center gap-3">
            <input
              type="range"
              min={RANGE_MIN}
              max={RANGE_MAX}
              step="1"
              value={threshold}
              onChange={event => setThreshold(parseInt(event.target.value, 10))}
              className="flex-1 accent-accent"
            />
            <div className="min-w-[50px] text-right text-lg font-semibold tabular-nums">
              {threshold}%
            </div>
          </div>
        </div>
      </div>

      <div className="card grid h-[calc(100vh-240px)] grid-cols-[320px_1fr]">
        <div className="flex flex-col overflow-hidden border-r border-line">
          <div className="shrink-0 border-b border-line px-3 pb-2 pt-3">
            <div className="relative">
              <SearchIcon
                width={13}
                height={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                className="input h-8 pl-[30px] text-xs"
                placeholder={`Search ${fields.length} fields\u2026`}
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </div>
            {query.trim() && (
              <div className="mt-1.5 pl-0.5 text-[11px] text-ink-500">
                {filteredFields.length} of {fields.length} fields
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            {filteredFields.length === 0 && (
              <div className="p-5 px-4 text-center text-xs italic text-ink-400">
                No fields match &ldquo;{query}&rdquo;
              </div>
            )}
            {filteredFields.map(field => (
              <div
                key={field.id}
                onClick={() => setSelectedId(field.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 border-b border-line px-4 py-2.5',
                  selectedId === field.id
                    ? 'border-l-[3px] border-l-accent bg-accent-50'
                    : 'border-l-[3px] border-l-transparent',
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium leading-snug">
                    {field.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-500">
                    {field.synonyms.length} synonym
                    {field.synonyms.length === 1 ? '' : 's'} &middot;{' '}
                    {field.rules.filter(rule => rule.trim()).length} rule
                    {field.rules.filter(rule => rule.trim()).length === 1
                      ? ''
                      : 's'}
                    {field.hint ? ' \u00B7 hint' : ''}
                  </div>
                </div>
                {field.hint && (
                  <SparkleIcon
                    width={12}
                    height={12}
                    className="shrink-0 text-accent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-auto p-6">
          {selected && (
            <div className="col gap-4">
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                  Field
                </div>
                <div className="mt-1 text-xl font-semibold tracking-tight">
                  {selected.label}
                </div>
              </div>

              <div className="field">
                <label className="label">Synonyms / alternative wording</label>
                <div className="hint">
                  Terms that the AI should treat as equivalent to &ldquo;
                  {selected.label}&rdquo;.
                </div>
                <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-md border border-line-strong bg-white p-2">
                  {selected.synonyms.map(synonym => (
                    <span
                      key={synonym}
                      className="badge badge-accent gap-1.5 py-[3px] pl-2.5 pr-1.5"
                    >
                      {synonym}
                      <button
                        type="button"
                        onClick={() => removeSynonym(synonym)}
                        className="flex cursor-pointer border-none bg-transparent p-0 text-inherit"
                        aria-label={`Remove synonym ${synonym}`}
                      >
                        <XIcon width={10} height={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    className="input h-6 min-w-[120px] flex-1 border-none bg-transparent p-0"
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
                  flagging and source guidance. Write one rule per line. Empty
                  lines are ignored.
                </div>
                <textarea
                  className="textarea min-h-[120px] font-[inherit] text-[12.5px] leading-relaxed"
                  value={selected.rules.join('\n')}
                  rows={RULES_ROWS}
                  placeholder={
                    'One rule per line. For example:\nSource: Income Statement section of the Annual Report.\nShould be \u2264 Revenue. If exceeded, flag as inconsistency.\nNegative values should be flagged as sign error.'
                  }
                  onChange={event =>
                    updateField({ rules: event.target.value.split('\n') })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReExtract(true)}
                >
                  <RefreshIcon width={13} height={13} />
                  Re-extract Companies
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

      <Modal
        open={showReExtract}
        onClose={closeReExtract}
        title="Re-extract Companies"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeReExtract}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={
                reExtractMode === 'selected' && reExtractSelectedCount === 0
              }
              onClick={handleReExtract}
            >
              <RefreshIcon width={13} height={13} />
              Start Re-extraction
            </button>
          </>
        }
      >
        <div className="col gap-12">
          <div className="hint leading-relaxed">
            Re-extraction uses the current synonyms, AI hints, validation rules,
            and Low-confidence threshold. PDFs are not re-downloaded &mdash;
            only the AI extraction step runs again.
          </div>

          <div className="col gap-8">
            <label
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-md border p-3',
                reExtractMode === 'all'
                  ? 'border-accent bg-accent-50'
                  : 'border-line bg-white',
              )}
            >
              <input
                type="radio"
                name="re-mode"
                checked={reExtractMode === 'all'}
                onChange={() => setReExtractMode('all')}
                className="mt-[3px]"
              />
              <div>
                <div className="text-[13.5px] font-medium">
                  All processed companies
                </div>
                <div className="hint mt-0.5">
                  Run re-extraction across all companies that have completed
                  extraction in this run
                </div>
              </div>
            </label>

            <label
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-md border p-3',
                reExtractMode === 'selected'
                  ? 'border-accent bg-accent-50'
                  : 'border-line bg-white',
              )}
            >
              <input
                type="radio"
                name="re-mode"
                checked={reExtractMode === 'selected'}
                onChange={() => setReExtractMode('selected')}
                className="mt-[3px]"
              />
              <div className="flex-1">
                <div className="text-[13.5px] font-medium">
                  Selected companies only
                </div>
                <div className="hint mt-0.5">
                  Pick specific companies &mdash; useful for testing parameter
                  changes
                </div>
              </div>
            </label>
          </div>

          {reExtractMode === 'selected' && (
            <>
              <div className="relative">
                <SearchIcon
                  width={13}
                  height={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  className="input h-8 pl-[30px] text-xs"
                  placeholder="Search companies\u2026"
                  value={reExtractQuery}
                  onChange={event => setReExtractQuery(event.target.value)}
                />
              </div>
              <div className="max-h-[280px] overflow-auto rounded-md border border-line">
                {filteredEligible.length === 0 && (
                  <div className="p-5 px-4 text-center text-xs italic text-ink-400">
                    No companies match &ldquo;{reExtractQuery}&rdquo;
                  </div>
                )}
                {filteredEligible.map((company: ICompany) => (
                  <label
                    key={company.id}
                    className="flex cursor-pointer items-center gap-2 border-b border-line px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={!!reExtractSelected[company.id]}
                      onChange={event =>
                        setReExtractSelected({
                          ...reExtractSelected,
                          [company.id]: event.target.checked,
                        })
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium">
                        {company.name}
                      </div>
                      <div className="text-[11px] text-ink-500">
                        {company.country} &middot; {company.sector}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="hint">
                {reExtractSelectedCount} compan
                {reExtractSelectedCount === 1 ? 'y' : 'ies'} selected
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
