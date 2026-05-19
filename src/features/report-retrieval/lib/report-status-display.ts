import { AnnualReportStatus } from 'shared/api';

export type ReportDisplayStatus =
  | 'Retrieved'
  | 'Manually Uploaded'
  | 'Not Retrieved'
  | 'Not Published'
  | 'Unknown';

export const mapAnnualReportStatus = (
  status: AnnualReportStatus | null,
): ReportDisplayStatus | null => {
  if (!status) {
    return null;
  }

  switch (status) {
    case 'Retrieved':
      return 'Retrieved';

    case 'ManuallyUploaded':
      return 'Manually Uploaded';

    case 'NotRetrieved':
      return 'Not Retrieved';

    case 'Unreadable':
      return 'Not Published';

    default:
      return 'Unknown';
  }
};
