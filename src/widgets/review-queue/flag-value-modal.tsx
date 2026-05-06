'use client';

import { useState } from 'react';

import { ICompany } from 'shared/api';
import { SendIcon } from 'shared/icons';
import { Modal, useToast } from 'shared/ui';

interface IFlagValueModalProps {
  open: boolean;
  onClose: () => void;
  companies: ICompany[];
}

export const FlagValueModal = ({
  open,
  onClose,
  companies,
}: IFlagValueModalProps) => {
  const toast = useToast();
  const [companyId, setCompanyId] = useState('');
  const [description, setDescription] = useState('');

  const eligible = companies.filter(
    company => company.stage === 'done' || company.stage === 'review',
  );

  const handleSubmit = () => {
    if (!companyId || !description.trim()) {
      return;
    }

    toast('Re-extraction queued \u00B7 results will appear in this queue', {
      tone: 'success',
    });
    setCompanyId('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Flag a value not caught by AI"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!companyId || !description.trim()}
            onClick={handleSubmit}
          >
            <SendIcon width={13} height={13} />
            Submit &amp; re-extract
          </button>
        </>
      }
    >
      <div className="col gap-12">
        <div className="hint">
          Use this when you spot an incorrect value in a workbook that the AI
          did not flag. The system will re-extract this company and the result
          will appear in the review queue.
        </div>
        <div className="field">
          <label className="label">
            Company<span className="req">*</span>
          </label>
          <select
            className="select"
            value={companyId}
            onChange={event => setCompanyId(event.target.value)}
          >
            <option value="">&mdash; Select a company &mdash;</option>
            {eligible.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">
            Description<span className="req">*</span>
          </label>
          <textarea
            className="textarea"
            rows={5}
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder="Describe the issue. Mention the specific field, year, and what you expected to see versus what was extracted."
          />
        </div>
      </div>
    </Modal>
  );
};
