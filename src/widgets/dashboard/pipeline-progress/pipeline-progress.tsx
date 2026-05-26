import { useMemo } from 'react';

import { IRunStats, RunItemStatus } from 'shared/api';
import {
  CloudIcon,
  FileTextIcon,
  FilterIcon,
  InboxIcon,
  SparkleIcon,
  XlsIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Progress } from 'shared/ui';

interface IPipelineProgressProps {
  stats: IRunStats;
  runStatus: RunItemStatus;
}

type StageState = 'active' | 'done' | 'idle';

interface IStageCell {
  label: string;
  icon: React.FC<React.SVGProps<SVGElement>>;
  state: StageState;
  count: number;
}

const STAGE_COUNT = 6;
const ACTIVE_STAGE_WEIGHT = 1;
const PERCENT_MULTIPLIER = 100;

const STAGE_DEFINITIONS = [
  { key: 'screening' as const, label: 'Screening', icon: FilterIcon },
  { key: 'retrieval' as const, label: 'Retrieval', icon: CloudIcon },
  { key: 'parsing' as const, label: 'Parsing', icon: FileTextIcon },
  { key: 'extraction' as const, label: 'Extraction', icon: SparkleIcon },
  { key: 'review' as const, label: 'Review', icon: InboxIcon },
  { key: 'output' as const, label: 'Output', icon: XlsIcon },
];

const deriveStageState = (args: {
  count: number;
  nextCount: number | null;
  isLastStage: boolean;
  isRunCompleted: boolean;
}): StageState => {
  const { count, nextCount, isLastStage, isRunCompleted } = args;

  if (count === 0) {
    return 'idle';
  }

  if (isLastStage) {
    return isRunCompleted ? 'done' : 'active';
  }

  if (nextCount !== null && nextCount > 0) {
    return 'done';
  }

  return 'active';
};

export const PipelineProgress = ({
  stats,
  runStatus,
}: IPipelineProgressProps) => {
  const isRunCompleted = runStatus === 'completed';

  const { stages, progressPct, currentStageLabel } = useMemo(() => {
    const stageCells: IStageCell[] = STAGE_DEFINITIONS.map(
      (stageDefinition, index) => {
        const count = stats[stageDefinition.key];
        const nextKey = STAGE_DEFINITIONS[index + 1]?.key;
        const nextCount = nextKey ? stats[nextKey] : null;

        return {
          label: stageDefinition.label,
          icon: stageDefinition.icon,
          count,
          state: deriveStageState({
            count,
            nextCount,
            isLastStage: index === STAGE_DEFINITIONS.length - 1,
            isRunCompleted,
          }),
        };
      },
    );

    const doneCount = stageCells.filter(stage => stage.state === 'done').length;
    const hasActive = stageCells.some(stage => stage.state === 'active');
    const progress = Math.round(
      ((doneCount + (hasActive ? ACTIVE_STAGE_WEIGHT : 0)) / STAGE_COUNT) *
        PERCENT_MULTIPLIER,
    );
    const activeStage = stageCells.find(stage => stage.state === 'active');

    return {
      stages: stageCells,
      progressPct: progress,
      currentStageLabel:
        activeStage?.label ??
        (isRunCompleted ? 'Complete' : 'Waiting to start'),
    };
  }, [stats, isRunCompleted]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="between mb-3">
          <div>
            <div className="card-title">Pipeline progress</div>
            <div className="card-sub">Currently in {currentStageLabel}</div>
          </div>
          <div className="text-2xl font-semibold tracking-[-0.02em] [font-variant-numeric:tabular-nums]">
            {progressPct}%
          </div>
        </div>
        <Progress value={progressPct} className="mb-3.5 h-2" />
        <div className="grid grid-cols-6 gap-2">
          {stages.map(stage => {
            const IconComponent = stage.icon;

            return (
              <div
                key={stage.label}
                className={cn(
                  'rounded-lg border border-line p-2.5 px-3',
                  stage.state === 'active' ? 'bg-accent-50' : 'bg-white',
                )}
              >
                <div className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
                  <IconComponent width={12} height={12} />
                  {stage.label}
                </div>
                <div className="mt-1 text-lg font-semibold [font-variant-numeric:tabular-nums]">
                  {stage.count}
                </div>
                {stage.state === 'active' && (
                  <div className="mt-0.5 text-[11px] text-accent">
                    ● Processing
                  </div>
                )}
                {stage.state === 'done' && (
                  <div className="mt-0.5 text-[11px] text-success">
                    ✓ Complete
                  </div>
                )}
                {stage.state === 'idle' && (
                  <div className="mt-0.5 text-[11px] text-ink-400">Pending</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
