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
        <div className="hint" style={{ lineHeight: 1.6 }}>
          This will replace the existing PDF for{' '}
          <strong>{target.company.name}</strong> &middot; reporting year{' '}
          <strong>{target.year}</strong>. Re-extraction will start automatically
          for this company once the new PDF is uploaded. Existing extracted
          values for this year will be re-evaluated and may change.
        </div>
        <div
          style={{
            padding: '10px 12px',
            background: '#FFF7E0',
            border: '1px solid #F0B73C',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--ink-700)',
          }}
        >
          The previous PDF will be archived and remains accessible in run
          history.
        </div>
      </div>
    )}
  </Modal>
);
