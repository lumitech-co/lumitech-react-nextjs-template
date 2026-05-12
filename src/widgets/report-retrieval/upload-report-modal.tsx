'use client';

import { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';

import { ICompany } from 'shared/api';
import { TrashIcon, UploadIcon } from 'shared/icons';
import { Modal, useToast } from 'shared/ui';

/* eslint-disable no-magic-numbers */

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const KB = 1024;
const MB = 1024 * 1024;

interface IUploadTarget {
  company: ICompany;
  year: number;
}

interface IUploadReportModalProps {
  target: IUploadTarget | null;
  onClose: () => void;
}

const formatSize = (bytes: number): string => {
  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)} MB`;
  }

  return `${(bytes / KB).toFixed(0)} KB`;
};

export const UploadReportModal = ({
  target,
  onClose,
}: IUploadReportModalProps) => {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!target) {
      setFile(null);
    }
  }, [target]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0] ?? null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = () => {
    toast('Report uploaded \u00B7 queued for parsing', { tone: 'success' });
    onClose();
  };

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title="Upload report manually"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!file}
            onClick={handleUpload}
          >
            <UploadIcon width={13} height={13} />
            Upload PDF
          </button>
        </>
      }
    >
      {target && (
        <div className="col gap-12">
          <div className="field">
            <label className="label">Company</label>
            <div style={{ fontWeight: 500 }}>{target.company.name}</div>
          </div>
          <div className="field">
            <label className="label">Reporting year</label>
            <div style={{ fontWeight: 500 }}>{target.year}</div>
          </div>
          <div className="field">
            <label className="label">
              PDF file<span className="req">*</span>
            </label>

            {file ? (
              <div
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <UploadIcon
                  width={16}
                  height={16}
                  style={{ color: 'var(--accent)', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                    {formatSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-icon btn-ghost"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                  style={{ height: 24, width: 24 }}
                >
                  <TrashIcon width={13} height={13} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  border: '2px dashed var(--line-strong)',
                  borderRadius: 8,
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: 'var(--ink-500)',
                  cursor: 'pointer',
                  background: isDragActive ? 'var(--accent-50)' : 'transparent',
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon
                  width={20}
                  height={20}
                  style={{ display: 'block', margin: '0 auto 6px' }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--ink-700)',
                  }}
                >
                  {isDragActive
                    ? 'Drop the PDF here'
                    : 'Drop PDF here or click to browse'}
                </div>
                <div className="hint">PDF only \u00B7 max 50MB</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
