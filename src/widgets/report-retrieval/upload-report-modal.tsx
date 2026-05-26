'use client';

import { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';

import { IReportCompanyItem } from 'shared/api';
import { TrashIcon, UploadIcon } from 'shared/icons';
import { cn } from 'shared/lib';
import { Modal } from 'shared/ui';

/* eslint-disable no-magic-numbers */

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const KB = 1024;
const MB = 1024 * 1024;

interface IUploadTarget {
  company: IReportCompanyItem;
  year: number;
}

interface IUploadReportModalProps {
  target: IUploadTarget | null;
  isUploading: boolean;
  onUpload: (
    company: IReportCompanyItem,
    year: number,
    file: File,
  ) => Promise<boolean>;
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
  isUploading,
  onUpload,
  onClose,
}: IUploadReportModalProps) => {
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

  const handleUpload = async () => {
    if (!target || !file) {
      return;
    }

    const success = await onUpload(target.company, target.year, file);

    if (success) {
      onClose();
    }
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
            disabled={!file || isUploading}
            onClick={() => {
              handleUpload().catch(() => undefined);
            }}
          >
            <UploadIcon width={13} height={13} />
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </>
      }
    >
      {target && (
        <div className="col gap-12">
          <div className="field">
            <label className="label">Company</label>
            <div className="font-medium">
              {target.company.companyProfile.name ?? '—'}
            </div>
          </div>
          <div className="field">
            <label className="label">Reporting year</label>
            <div className="font-medium">{target.year}</div>
          </div>
          <div className="field">
            <label className="label">
              PDF file<span className="req">*</span>
            </label>

            {file ? (
              <div className="flex items-center gap-2.5 rounded-lg border border-line px-4 py-3">
                <UploadIcon
                  width={16}
                  height={16}
                  className="shrink-0 text-accent"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">
                    {file.name}
                  </div>
                  <div className="text-[11px] text-ink-400">
                    {formatSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-icon btn-ghost size-6"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                >
                  <TrashIcon width={13} height={13} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  'cursor-pointer rounded-lg border-2 border-dashed border-line-strong px-4 py-6 text-center text-ink-500',
                  isDragActive && 'bg-accent-50',
                )}
              >
                <input {...getInputProps()} />
                <UploadIcon
                  width={20}
                  height={20}
                  className="mx-auto mb-1.5 block"
                />
                <div className="text-[13px] font-medium text-ink-700">
                  {isDragActive
                    ? 'Drop the PDF here'
                    : 'Drop PDF here or click to browse'}
                </div>
                <div className="hint">PDF only &middot; max 50MB</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
