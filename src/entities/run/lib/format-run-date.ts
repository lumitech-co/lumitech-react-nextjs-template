export const formatRunDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date);
};
