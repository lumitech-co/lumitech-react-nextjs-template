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
          <div className="rounded-md bg-surface-2 px-3 py-2.5 text-xs text-ink-700">
            <strong>Read-only view.</strong> {run.period}
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            <div className="rounded-md border border-line px-3 py-2.5">
              <div className="text-[11px] text-ink-500">Companies</div>
              <div className="mt-0.5 text-lg font-semibold">
                {run.companies}
              </div>
            </div>
            <div className="rounded-md border border-line px-3 py-2.5">
              <div className="text-[11px] text-ink-500">Avg score</div>
              <div className="mt-0.5 text-lg font-semibold">{avgScore}</div>
            </div>
            <div className="rounded-md border border-line px-3 py-2.5">
              <div className="text-[11px] text-ink-500">Conviction</div>
              <div className="mt-0.5 text-lg font-semibold">
                {run.conviction === null ? '—' : `${run.conviction}%`}
              </div>
            </div>
            <div className="rounded-md border border-line px-3 py-2.5">
              <div className="text-[11px] text-ink-500">Flagged</div>
              <div className="mt-0.5 text-lg font-semibold text-danger">
                {run.flags ?? '—'}
              </div>
            </div>
          </div>
          <div className="max-h-[280px] overflow-auto rounded-md border border-line">
            <table className="tbl m-0 text-xs">
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
                    <td className="font-mono text-[11px] text-ink-500">
                      {row.ric}
                    </td>
                    <td className="tnum text-right font-semibold">
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
