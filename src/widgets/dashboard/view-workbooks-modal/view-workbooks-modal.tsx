import { IArchivedRun, IWorkbookRow } from 'shared/api';
import { DownloadIcon } from 'shared/icons';
import { Modal, useToast } from 'shared/ui';

interface IViewWorkbooksModalProps {
  run: IArchivedRun | null;
  rows: IWorkbookRow[];
  onClose: () => void;
}

export const ViewWorkbooksModal = ({
  run,
  rows,
  onClose,
}: IViewWorkbooksModalProps) => {
  const toast = useToast();

  const handleDownloadAll = () => {
    toast(`Downloading all workbooks for ${run!.label}.zip`, {
      tone: 'success',
    });
    onClose();
  };

  return (
    <Modal
      open={!!run}
      onClose={onClose}
      title={run ? `Workbooks · ${run.label}` : ''}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadAll}
          >
            <DownloadIcon width={13} height={13} />
            Download All (.zip)
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
            <strong>Read-only view.</strong> {run.period} · {run.companies}{' '}
            companies · {run.conviction === null ? '—' : `${run.conviction}%`}{' '}
            conviction
          </div>
          <div
            style={{
              maxHeight: 380,
              overflow: 'auto',
              border: '1px solid var(--line)',
              borderRadius: 6,
            }}
          >
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>RIC</th>
                  <th className="text-right">Conviction</th>
                  <th className="col-actions" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.company}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{row.company}</div>
                    </td>
                    <td
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 11.5,
                        color: 'var(--ink-500)',
                      }}
                    >
                      {row.ric}
                    </td>
                    <td className="tnum text-right">{row.conviction}%</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          toast(`Downloaded · ${row.company}.xlsx`, {
                            tone: 'success',
                          })
                        }
                      >
                        <DownloadIcon width={11} height={11} />
                        .xlsx
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hint">
            Showing{' '}
            {run.companies > rows.length
              ? `${rows.length} of ${run.companies}`
              : run.companies}{' '}
            companies · use Download All to get the full archive
          </div>
        </div>
      )}
    </Modal>
  );
};
