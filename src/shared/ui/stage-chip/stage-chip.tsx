const STAGE_LABELS: Record<string, string> = {
  queued: 'Queued',
  screening: 'Screening',
  retrieval: 'Retrieval',
  parsing: 'Parsing',
  extraction: 'Extraction',
  review: 'Needs review',
  output: 'Output',
  done: 'Done',
  failed: 'Failed',
  pending_retrieval: 'Pending',
  excluded: 'Excluded',
};

interface IStageChipProps {
  stage: string;
}

export const StageChip = ({ stage }: IStageChipProps) => {
  let cls = 'active';

  if (stage === 'done') {
    cls = 'done';
  } else if (stage === 'failed') {
    cls = 'failed';
  }

  return (
    <span className={`pipe-stage w-fit ${cls}`}>
      {STAGE_LABELS[stage] || stage}
    </span>
  );
};
