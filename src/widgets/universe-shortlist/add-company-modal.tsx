'use client';

import { useCallback, useEffect, useState } from 'react';

import { ICompany } from 'shared/api';
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

interface IFoundCompany {
  name: string;
  website: string;
  sharePrice: string;
  sector: string;
  country: string;
  mcap: number;
  weight: number;
}

interface IAddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (company: IFoundCompany) => void;
  existing: ICompany[];
}

const SEARCH_DELAY = 1100;
const FAKE_SECTORS = [
  'Technology',
  'Health Care',
  'Industrial Goods & Services',
  'Retail',
];
const MCAP_RANGE = 8;
const MCAP_OFFSET = 0.5;
const PRICE_RANGE = 80;
const PRICE_OFFSET = 20;
const SCREENING_MIN = 2;

export const AddCompanyModal = ({
  open,
  onClose,
  onAdd,
  existing,
}: IAddCompanyModalProps) => {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState('');
  const [websiteHint, setWebsiteHint] = useState('');
  const [found, setFound] = useState<IFoundCompany | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setName('');
      setWebsiteHint('');
      setFound(null);
      setSearching(false);
    }
  }, [open]);

  const search = useCallback(() => {
    if (!name.trim()) {
      return;
    }

    const duplicate = existing.find(
      company => company.name.toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicate) {
      setStep(99);

      return;
    }

    setSearching(true);
    setTimeout(() => {
      const cleanedHint = websiteHint
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
      const fakeWeb =
        cleanedHint || `${name.toLowerCase().replace(/[^a-z]/g, '')}.com`;
      const fakeMcap = +(MCAP_OFFSET + Math.random() * MCAP_RANGE).toFixed(2);

      setFound({
        name: name.trim(),
        website: fakeWeb,
        sharePrice: `\u20AC${(PRICE_OFFSET + Math.random() * PRICE_RANGE).toFixed(2)}`,
        sector:
          FAKE_SECTORS[Math.floor(Math.random() * FAKE_SECTORS.length)] ??
          'Technology',
        country: 'DE',
        mcap: fakeMcap,
        weight: 0,
      });
      setSearching(false);
      setStep(1);
    }, SEARCH_DELAY);
  }, [name, websiteHint, existing]);

  const confirm = useCallback(() => {
    if (!found) {
      return;
    }

    if (found.mcap < SCREENING_MIN) {
      setStep(2);
    } else {
      onAdd(found);
      onClose();
    }
  }, [found, onAdd, onClose]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        search();
      }
    },
    [search],
  );

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
            onClick={search}
            disabled={!name.trim() || searching}
          >
            {searching ? (
              <>
                <RefreshIcon width={13} height={13} className="spin" />
                Searching\u2026
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
          <button type="button" className="btn btn-primary" onClick={confirm}>
            <CheckIcon width={13} height={13} />
            Yes, Add This Company
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
            onClick={() => {
              if (found) {
                onAdd({ ...found });
              }

              onClose();
            }}
          >
            <AlertIcon width={13} height={13} />
            Include Anyway
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
            Enter the company name. We&apos;ll attempt to find its official
            website and current share price online to confirm identity before
            adding it to the shortlist. Optionally hint the website if multiple
            companies share the same name.
          </div>
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
              <span style={{ color: 'var(--ink-400)', fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              className="input"
              value={websiteHint}
              onChange={event => setWebsiteHint(event.target.value)}
              placeholder="e.g. spotify.com \u2014 helps disambiguate similar names"
              onKeyDown={handleKeyDown}
            />
            <div className="hint">
              Leave blank if the company name is unique. Use this when there
              might be multiple companies sharing the same or similar name.
            </div>
          </div>
        </div>
      )}

      {step === 1 && found && (
        <div className="col gap-16">
          <div className="hint">
            We found the following \u2014 please confirm this is the company you
            meant.
          </div>
          <div
            className="card"
            style={{ boxShadow: 'none', background: 'var(--surface-2)' }}
          >
            <div className="card-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: 'var(--accent-50)',
                    color: 'var(--accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  {found.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {found.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
                    {found.sector} \u00B7 {found.country}
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <div className="hint">Official website</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    <a className="link">{found.website}</a>{' '}
                    <ExternalIcon width={11} height={11} />
                  </div>
                </div>
                <div>
                  <div className="hint">Current share price</div>
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {found.sharePrice}
                  </div>
                </div>
                <div>
                  <div className="hint">Estimated market cap</div>
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    \u00A3{found.mcap.toFixed(2)}bn
                  </div>
                </div>
                <div>
                  <div className="hint">Will be screened against</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    Sector exclusions + \u00A32bn min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && found && (
        <div className="col gap-12">
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: 12,
              borderRadius: 8,
              background: 'var(--warning-bg)',
              color: 'var(--warning)',
            }}
          >
            <AlertIcon width={18} height={18} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                Failed screening: market cap below threshold
              </div>
              <div style={{ fontSize: 12.5 }}>
                {found.name} has an estimated market cap of \u00A3
                {found.mcap.toFixed(2)}bn, below the \u00A32bn minimum. You can
                override this rule and include it anyway with reason{' '}
                <code className="mono">manual_override</code>.
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 99 && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: 12,
            borderRadius: 8,
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
          }}
        >
          <AlertIcon width={18} height={18} />
          <div>
            <strong>Company already exists</strong>
            <div style={{ fontSize: 12.5, marginTop: 2 }}>
              &quot;{name}&quot; is already in the shortlist.
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
