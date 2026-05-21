'use client';

import { IReportCompanyItem } from 'shared/api';
import { Modal, useToast } from 'shared/ui';

interface IEditWebsiteModalProps {
  company: IReportCompanyItem | null;
  onClose: () => void;
}

export const EditWebsiteModal = ({
  company,
  onClose,
}: IEditWebsiteModalProps) => {
  const toast = useToast();

  const handleSave = () => {
    toast('Website updated · will be reused on future runs', {
      tone: 'success',
    });
    onClose();
  };

  const domain = company?.companyProfile.domain ?? '';

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
            onClick={handleSave}
          >
            Save
          </button>
        </>
      }
    >
      {company && (
        <div className="col gap-12">
          <div className="hint">
            Once saved, this website is reused on all future runs without
            re-discovery.
          </div>
          <div className="field">
            <label className="label">Company</label>
            <div style={{ fontWeight: 500 }}>
              {company.companyProfile.name ?? '—'}
            </div>
          </div>
          <div className="field">
            <label className="label">Official website</label>
            <input
              className="input"
              defaultValue={domain ? `https://${domain}` : ''}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
