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
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-body">
        <div className="between" style={{ marginBottom: 12 }}>
          <div>
            <div className="card-title">Pipeline progress</div>
            <div className="card-sub">Currently in {currentStageLabel}</div>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}
          >
            {progressPct}%
          </div>
        </div>
        <Progress value={progressPct} style={{ height: 8, marginBottom: 14 }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 8,
          }}
        >
          {stages.map(stage => {
            const IconComponent = stage.icon;

            return (
              <div
                key={stage.label}
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  background:
                    stage.state === 'active' ? 'var(--accent-50)' : '#fff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11.5,
                    color: 'var(--ink-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                  }}
                >
                  <IconComponent width={12} height={12} />
                  {stage.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginTop: 4,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stage.count}
                </div>
                {stage.state === 'active' && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--accent)',
                      marginTop: 2,
                    }}
                  >
                    ● Processing
                  </div>
                )}
                {stage.state === 'done' && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--success)',
                      marginTop: 2,
                    }}
                  >
                    ✓ Complete
                  </div>
                )}
                {stage.state === 'idle' && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-400)',
                      marginTop: 2,
                    }}
                  >
                    Pending
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
