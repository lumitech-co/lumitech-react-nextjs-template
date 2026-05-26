'use client';

import { useRouter } from 'next/navigation';

import { IRunCompanyItem } from 'shared/api';
import { ArrowRightIcon } from 'shared/icons';
import { useInfiniteScroll } from 'shared/lib';
import { Badge } from 'shared/ui';

import { ROUTE_PATHS } from '../../app-shell/sidebar/nav-config';

const GBP_PER_BILLION = 1_000_000_000;

interface ICompaniesPipelineProps {
  companies: IRunCompanyItem[];
  isLoading?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

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
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ICompaniesPipelineProps) => {
  const router = useRouter();
  const sentinelRef = useInfiniteScroll<HTMLTableRowElement>({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: onLoadMore,
  });

  return (
    <div className="card flex h-[370px] flex-col">
      <div className="card-header shrink-0">
        <div className="card-title">Companies in pipeline</div>
        <div className="spacer" />
        <span
          className="link flex cursor-pointer items-center justify-center gap-0.5 text-xs"
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
      <div className="table-wrap min-h-0 flex-1 overflow-y-auto">
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
            {!isLoading && companies.length === 0 && (
              <tr>
                <td colSpan={4} className="dim">
                  No shortlisted companies yet
                </td>
              </tr>
            )}
            {!isLoading &&
              companies.map(company => (
                <tr key={company.id}>
                  <td>
                    <div className="font-medium">
                      {company.companyProfile.name}
                    </div>
                    <div className="text-[11.5px] text-ink-500">
                      {company.companyProfile.country ?? '—'} ·{' '}
                      {company.companyProfile.ric ?? '—'}
                    </div>
                  </td>
                  <td className="text-ink-500">
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
            {!isLoading && hasNextPage && (
              <tr ref={sentinelRef}>
                <td colSpan={4} className="dim">
                  {isFetchingNextPage && 'Loading more...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
