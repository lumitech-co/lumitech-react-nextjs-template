'use client';

import { ICompany } from 'shared/api';
import { UploadIcon } from 'shared/icons';
import { Modal } from 'shared/ui';

interface IReuploadTarget {
  company: ICompany;
  year: number;
}

interface IReuploadConfirmModalProps {
  target: IReuploadTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReuploadConfirmModal = ({
  target,
  onClose,
  onConfirm,
}: IReuploadConfirmModalProps) => (
  <Modal
    open={!!target}
    onClose={onClose}
    title="Replace existing PDF?"
    footer={
      <>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onConfirm}>
          <UploadIcon width={13} height={13} />
          Continue to Re-upload
        </button>
      </>
    }
  >
    {target && (
      <div className="col gap-12">
        <div className="hint leading-relaxed">
          This will replace the existing PDF for{' '}
          <strong>{target.company.name}</strong> &middot; reporting year{' '}
          <strong>{target.year}</strong>. Re-extraction will start automatically
          for this company once the new PDF is uploaded. Existing extracted
          values for this year will be re-evaluated and may change.
        </div>
        <div className="rounded-md border border-warning bg-warning-bg px-3 py-2.5 text-xs text-ink-700">
          The previous PDF will be archived and remains accessible in run
          history.
        </div>
      </div>
    )}
  </Modal>
);
