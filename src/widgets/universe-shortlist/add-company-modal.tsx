'use client';

import { useCallback, useEffect, useState } from 'react';

import { IAddRunCompanyRequest, ISearchCompanyResult } from 'shared/api';
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  ExternalIcon,
  RefreshIcon,
} from 'shared/icons';
import { Modal } from 'shared/ui';

/* eslint-disable no-magic-numbers */

type Step = 0 | 1 | 2 | 99;

const SCREENING_MIN_GBP = 2_000_000_000;
const GBP_PER_BILLION = 1_000_000_000;

interface IAddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (company: IAddRunCompanyRequest) => void | Promise<void>;
  onSearch: (
    name: string,
    domain?: string,
  ) => Promise<ISearchCompanyResult | null>;
  isSearching: boolean;
  isAdding: boolean;
  existingNames: string[];
}

export const AddCompanyModal = ({
  open,
  onClose,
  onAdd,
  onSearch,
  isSearching,
  isAdding,
  existingNames,
}: IAddCompanyModalProps) => {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState('');
  const [websiteHint, setWebsiteHint] = useState('');
  const [found, setFound] = useState<ISearchCompanyResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setName('');
      setWebsiteHint('');
      setFound(null);
      setNotFound(false);
    }
  }, [open]);

  const search = useCallback(async () => {
    if (!name.trim()) {
      return;
    }

    const duplicate = existingNames.some(
      existing => existing.toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicate) {
      setStep(99);

      return;
    }

    setNotFound(false);
    const domainHint = websiteHint
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    const result = await onSearch(name.trim(), domainHint || undefined);

    if (!result?.name) {
      setFound(null);
      setNotFound(true);
      setStep(0);

      return;
    }

    setFound(result);
    setStep(1);
  }, [name, websiteHint, existingNames, onSearch]);

  const buildAddPayload = useCallback((): IAddRunCompanyRequest | null => {
    if (!found) {
      return null;
    }

    const domain =
      found.domain ??
      websiteHint
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');

    if (!domain) {
      return null;
    }

    const marketCapGbp = found.marketCapGbp
      ? Number(found.marketCapGbp)
      : undefined;

    return {
      name: found.name,
      domain,
      ric: found.ric ?? undefined,
      country: found.country ?? undefined,
      supersector: found.supersector ?? undefined,
      marketCapGbp:
        marketCapGbp && !Number.isNaN(marketCapGbp) ? marketCapGbp : undefined,
    };
  }, [found, websiteHint]);

  const confirm = useCallback(async () => {
    const payload = buildAddPayload();

    if (!payload) {
      return;
    }

    const marketCapGbp = payload.marketCapGbp ?? 0;

    if (marketCapGbp > 0 && marketCapGbp < SCREENING_MIN_GBP) {
      setStep(2);
    } else {
      await onAdd(payload);
      onClose();
    }
  }, [buildAddPayload, onAdd, onClose]);

  const includeAnyway = useCallback(async () => {
    const payload = buildAddPayload();

    if (!payload) {
      return;
    }

    await onAdd(payload);
    onClose();
  }, [buildAddPayload, onAdd, onClose]);

  const handleSearchClick = useCallback(() => {
    search().catch(() => undefined);
  }, [search]);

  const handleConfirmClick = useCallback(() => {
    confirm().catch(() => undefined);
  }, [confirm]);

  const handleIncludeAnywayClick = useCallback(() => {
    includeAnyway().catch(() => undefined);
  }, [includeAnyway]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearchClick();
      }
    },
    [handleSearchClick],
  );

  const marketCapBillions =
    found?.marketCapGbp == null
      ? null
      : Number(found.marketCapGbp) / GBP_PER_BILLION;

  const renderFooter = () => {
    if (step === 0) {
      return (
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSearchClick}
            disabled={!name.trim() || isSearching}
          >
            {isSearching ? (
              <>
                <RefreshIcon width={13} height={13} className="spin" />
                Searching&hellip;
              </>
            ) : (
              <>
                Find company <ArrowRightIcon width={13} height={13} />
              </>
            )}
          </button>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(0)}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirmClick}
            disabled={isAdding}
          >
            <CheckIcon width={13} height={13} />
            {isAdding ? 'Adding...' : 'Yes, Add This Company'}
          </button>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleIncludeAnywayClick}
            disabled={isAdding}
          >
            <AlertIcon width={13} height={13} />
            {isAdding ? 'Adding...' : 'Include Anyway'}
          </button>
        </>
      );
    }

    return (
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Close
      </button>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add company manually"
      size="lg"
      footer={renderFooter()}
    >
      {step === 0 && (
        <div className="col gap-12">
          <div className="hint">
            Enter the company name. We&apos;ll look it up using the parser
            service. Optionally hint the website if multiple companies share the
            same name.
          </div>
          {notFound && (
            <div className="flex gap-2.5 rounded-lg bg-warning-bg p-3 text-warning">
              <AlertIcon width={18} height={18} />
              <div className="text-[12.5px]">
                No company found for &quot;{name}&quot;. Try a different name or
                add a website hint.
              </div>
            </div>
          )}
          <div className="field">
            <label className="label">
              Company name<span className="req">*</span>
            </label>
            <input
              className="input"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g. Spotify Technology"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="field">
            <label className="label">
              Company website{' '}
              <span className="font-normal text-ink-400">(optional)</span>
            </label>
            <input
              className="input"
              value={websiteHint}
              onChange={event => setWebsiteHint(event.target.value)}
              placeholder="e.g. spotify.com — helps disambiguate similar names"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {step === 1 && found && (
        <div className="col gap-16">
          <div className="hint">
            We found the following — please confirm this is the company you
            meant.
          </div>
          <div className="card bg-surface-2 shadow-none">
            <div className="card-body">
              <div className="mb-3.5 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-accent-50 font-bold text-accent">
                  {found.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-semibold">{found.name}</div>
                  <div className="text-xs text-ink-500">
                    {found.supersector ?? '—'} · {found.country ?? '—'}
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <div className="hint">Official website</div>
                  <div className="mt-0.5 text-[13px]">
                    <a className="link">{found.domain ?? '—'}</a>{' '}
                    {found.domain && <ExternalIcon width={11} height={11} />}
                  </div>
                </div>
                <div>
                  <div className="hint">Market cap (GBP)</div>
                  <div className="mt-0.5 text-[13px] [font-variant-numeric:tabular-nums]">
                    {marketCapBillions != null &&
                    !Number.isNaN(marketCapBillions)
                      ? `£${marketCapBillions.toFixed(2)}bn`
                      : '—'}
                  </div>
                </div>
                <div>
                  <div className="hint">RIC</div>
                  <div className="mt-0.5 text-[13px]">{found.ric ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && found && marketCapBillions != null && (
        <div className="col gap-12">
          <div className="flex gap-2.5 rounded-lg bg-warning-bg p-3 text-warning">
            <AlertIcon width={18} height={18} />
            <div>
              <div className="mb-0.5 font-semibold">
                Failed screening: market cap below threshold
              </div>
              <div className="text-[12.5px]">
                {found.name} has an estimated market cap of £
                {marketCapBillions.toFixed(2)}bn, below the £2bn minimum. You
                can override this rule and include it anyway.
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 99 && (
        <div className="flex gap-2.5 rounded-lg bg-danger-bg p-3 text-danger">
          <AlertIcon width={18} height={18} />
          <div>
            <strong>Company already exists</strong>
            <div className="mt-0.5 text-[12.5px]">
              &quot;{name}&quot; is already in the shortlist.
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
