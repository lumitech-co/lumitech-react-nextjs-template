import { IArchivedRun } from 'shared/api';
import { ArchiveIcon, LayersIcon, XlsIcon } from 'shared/icons';
import { Badge } from 'shared/ui';

interface IPreviousRunsProps {
  archivedRuns: IArchivedRun[];
  onViewWorkbooks: (run: IArchivedRun) => void;
  onViewSummary: (run: IArchivedRun) => void;
}

export const PreviousRuns = ({
  archivedRuns,
  onViewWorkbooks,
  onViewSummary,
}: IPreviousRunsProps) => (
  <div className="card" style={{ marginTop: 16, marginBottom: 24 }}>
    <div className="card-header between">
      <div>
        <div className="card-title">Previous Runs</div>
        <div className="card-sub">
          Historical runs are read-only · workbooks and summaries remain
          available
        </div>
      </div>
      <Badge tone="neutral" withDot={false}>
        {archivedRuns.length} archived
      </Badge>
    </div>
    <div style={{ padding: 0 }}>
      {archivedRuns.map((archivedRun, index) => (
        <div
          key={archivedRun.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 16px',
            borderBottom:
              index < archivedRuns.length - 1
                ? '1px solid var(--line)'
                : 'none',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'var(--ink-100)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--ink-600)',
              flexShrink: 0,
            }}
          >
            <ArchiveIcon width={14} height={14} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              {archivedRun.label}{' '}
              <Badge tone="success" style={{ marginLeft: 8, fontSize: 10 }}>
                Completed
              </Badge>
            </div>
            <div
              style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}
            >
              {archivedRun.period} · {archivedRun.companies} companies ·{' '}
              {archivedRun.conviction}% conviction · {archivedRun.flags} flagged
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onViewWorkbooks(archivedRun)}
            >
              <XlsIcon width={12} height={12} />
              View Workbooks
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onViewSummary(archivedRun)}
            >
              <LayersIcon width={12} height={12} />
              View Summary
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
