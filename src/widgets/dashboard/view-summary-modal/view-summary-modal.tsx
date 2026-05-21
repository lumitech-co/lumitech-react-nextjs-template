import { IArchivedRun, ISummaryRow } from 'shared/api';
import { DownloadIcon } from 'shared/icons';
import { Modal, useToast } from 'shared/ui';

interface IViewSummaryModalProps {
  run: IArchivedRun | null;
  rows: ISummaryRow[];
  onClose: () => void;
}

export const ViewSummaryModal = ({
  run,
  rows,
  onClose,
}: IViewSummaryModalProps) => {
  const toast = useToast();

  const handleDownload = () => {
    toast(`Downloaded · iron-blue-summary-${run!.id}.xlsx`, {
      tone: 'success',
    });
    onClose();
  };

  const AVG_SCORE_BASE = 6.5;
  const AVG_SCORE_DIVISOR = 40;
  const avgScore = (() => {
    if (!run || run.conviction === null) {
      return '—';
    }

    return (AVG_SCORE_BASE + run.conviction / AVG_SCORE_DIVISOR).toFixed(1);
  })();

  return (
    <Modal
      open={!!run}
      onClose={onClose}
      title={run ? `Consolidated Summary · ${run.label}` : ''}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownload}
          >
            <DownloadIcon width={13} height={13} />
            Download Summary
          </button>
        </>
      }
    >
      {run && (
        <div className="col gap-12">
          <div
            style={{
              padding: '10px 12px',
              background: 'var(--surface-2)',
              borderRadius: 6,
              fontSize: 12,
              color: 'var(--ink-700)',
            }}
          >
            <strong>Read-only view.</strong> {run.period}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
            }}
          >
            <div
              style={{
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                Companies
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                {run.companies}
              </div>
            </div>
            <div
              style={{
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                Avg score
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                {avgScore}
              </div>
            </div>
            <div
              style={{
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                Conviction
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                {run.conviction === null ? '—' : `${run.conviction}%`}
              </div>
            </div>
            <div
              style={{
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                Flagged
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginTop: 2,
                  color: 'var(--danger)',
                }}
              >
                {run.flags ?? '—'}
              </div>
            </div>
          </div>
          <div
            style={{
              maxHeight: 280,
              overflow: 'auto',
              border: '1px solid var(--line)',
              borderRadius: 6,
            }}
          >
            <table className="tbl" style={{ margin: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>RIC</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Conviction</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.company}>
                    <td>{row.company}</td>
                    <td
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 11,
                        color: 'var(--ink-500)',
                      }}
                    >
                      {row.ric}
                    </td>
                    <td className="tnum text-right" style={{ fontWeight: 600 }}>
                      {row.total}
                    </td>
                    <td className="tnum text-right">{row.conviction}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hint">
            Preview only · Download Summary for the full Excel file with all{' '}
            {run.companies} companies
          </div>
        </div>
      )}
    </Modal>
  );
};
