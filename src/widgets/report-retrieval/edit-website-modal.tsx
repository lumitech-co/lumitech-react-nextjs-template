'use client';

import { useEditWebsiteForm } from 'features';
import { IReportCompanyItem } from 'shared/api';
import { Modal } from 'shared/ui';

interface IEditWebsiteModalProps {
  runId: string | null;
  company: IReportCompanyItem | null;
  onClose: () => void;
}

export const EditWebsiteModal = ({
  runId,
  company,
  onClose,
}: IEditWebsiteModalProps) => {
  const { form, onSubmit, isSaving } = useEditWebsiteForm({
    runId,
    company,
    onSuccess: onClose,
  });

  const {
    register,
    formState: { errors, isDirty },
  } = form;

  return (
    <Modal
      open={!!company}
      onClose={onClose}
      title="Edit official website"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onSubmit().catch(() => undefined);
            }}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </>
      }
    >
      {company && (
        <form className="col gap-3" onSubmit={onSubmit}>
          <div className="hint">
            Once saved, this website is reused on all future runs without
            re-discovery.
          </div>
          <div className="field">
            <label className="label">Company</label>
            <div className="font-medium">
              {company.companyProfile.name ?? '—'}
            </div>
          </div>
          <div className="field">
            <label className="label">
              Official website<span className="req">*</span>
            </label>
            <input
              className="input"
              placeholder="e.g. spotify.com"
              {...register('domain')}
            />
            {errors.domain?.message && (
              <div className="text-xs text-danger">{errors.domain.message}</div>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};
