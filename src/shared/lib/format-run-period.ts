export const formatRunPeriod = (
  startedAt: string,
  completedAt: string | null,
): string => {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(iso));

  return completedAt
    ? `${fmt(startedAt)} – ${fmt(completedAt)}`
    : `${fmt(startedAt)} – ongoing`;
};
