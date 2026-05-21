'use client';

import { useRouter } from 'next/navigation';

import { IRunCompanyItem } from 'shared/api';
import { ArrowRightIcon } from 'shared/icons';
import { Badge } from 'shared/ui';

import { ROUTE_PATHS } from '../../app-shell/sidebar/nav-config';

interface ICompaniesPipelineProps {
  companies: IRunCompanyItem[];
  isLoading?: boolean;
}

const VISIBLE_COUNT = 12;
const GBP_PER_BILLION = 1_000_000_000;

const formatMarketCap = (value: string | null): string => {
  if (!value) {
    return '—';
  }

  const billions = Number(value) / GBP_PER_BILLION;

  if (Number.isNaN(billions)) {
    return '—';
  }

  return `£${billions.toFixed(1)}bn`;
};

export const CompaniesPipeline = ({
  companies,
  isLoading = false,
}: ICompaniesPipelineProps) => {
  const router = useRouter();
  const recent = companies.slice(0, VISIBLE_COUNT);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Companies in pipeline</div>
        <div className="spacer" />
        <span
          className="link"
          style={{ fontSize: 12, cursor: 'pointer' }}
          onClick={() => router.push(ROUTE_PATHS.universe)}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              router.push(ROUTE_PATHS.universe);
            }
          }}
        >
          View all <ArrowRightIcon width={11} height={11} />
        </span>
      </div>
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Company</th>
              <th>Sector</th>
              <th>Market cap</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="dim">
                  Loading companies&hellip;
                </td>
              </tr>
            )}
            {!isLoading && recent.length === 0 && (
              <tr>
                <td colSpan={4} className="dim">
                  No shortlisted companies yet
                </td>
              </tr>
            )}
            {!isLoading &&
              recent.map(company => (
                <tr key={company.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {company.companyProfile.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>
                      {company.companyProfile.country ?? '—'} ·{' '}
                      {company.companyProfile.ric ?? '—'}
                    </div>
                  </td>
                  <td style={{ color: 'var(--ink-500)' }}>
                    {company.companyProfile.supersector ?? '—'}
                  </td>
                  <td>{formatMarketCap(company.marketCapGbp)}</td>
                  <td>
                    <Badge tone="neutral" withDot={false}>
                      {company.status}
                    </Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
