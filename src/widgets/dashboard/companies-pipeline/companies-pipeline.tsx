import { ICompany } from 'shared/api';
import { ArrowRightIcon } from 'shared/icons';
import { Conviction, StageChip } from 'shared/ui';

interface ICompaniesPipelineProps {
  companies: ICompany[];
  onGoto?: (route: string) => void;
}

const VISIBLE_COUNT = 12;

export const CompaniesPipeline = ({
  companies,
  onGoto,
}: ICompaniesPipelineProps) => {
  const recent = companies.slice(0, VISIBLE_COUNT);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Companies in pipeline</div>
        <div className="spacer" />
        <span
          className="link"
          style={{ fontSize: 12, cursor: 'pointer' }}
          onClick={() => onGoto?.('universe')}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onGoto?.('universe');
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
              <th>Stage</th>
              <th>Conviction</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(company => (
              <tr key={company.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{company.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>
                    {company.country} · £{company.mcap}bn
                  </div>
                </td>
                <td style={{ color: 'var(--ink-500)' }}>{company.sector}</td>
                <td>
                  <StageChip stage={company.stage} />
                </td>
                <td>
                  {company.conviction == null ? (
                    <span className="dim">—</span>
                  ) : (
                    <Conviction value={company.conviction} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
