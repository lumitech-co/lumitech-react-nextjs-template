import { useMemo } from 'react';

import { ICompany, IRun } from 'shared/api';
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
  run: IRun;
  companies: ICompany[];
}

type StageState = 'active' | 'done' | 'idle';

interface IStageCell {
  label: string;
  icon: React.FC<React.SVGProps<SVGElement>>;
  state: StageState;
  count: number;
}

export const PipelineProgress = ({
  run,
  companies,
}: IPipelineProgressProps) => {
  const stageCount = useMemo(() => {
    const counts: Record<string, number> = {
      screening: 0,
      retrieval: 0,
      parsing: 0,
      extraction: 0,
      review: 0,
      done: 0,
      excluded: 0,
      failed: 0,
    };

    companies.forEach(company => {
      counts[company.stage] = (counts[company.stage] || 0) + 1;
    });

    return counts;
  }, [companies]);

  const stages: IStageCell[] = [
    {
      label: 'Screening',
      icon: FilterIcon,
      state: 'done',
      count: run.totals.screened,
    },
    {
      label: 'Retrieval',
      icon: CloudIcon,
      state: 'done',
      count: run.totals.shortlisted - stageCount.retrieval,
    },
    {
      label: 'Parsing',
      icon: FileTextIcon,
      state: 'done',
      count: 33,
    },
    {
      label: 'Extraction',
      icon: SparkleIcon,
      state: 'active',
      count: stageCount.extraction + stageCount.review,
    },
    {
      label: 'Review',
      icon: InboxIcon,
      state: stageCount.review > 0 ? 'active' : 'idle',
      count: stageCount.review,
    },
    {
      label: 'Output',
      icon: XlsIcon,
      state: 'idle',
      count: stageCount.done,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-body">
        <div className="between" style={{ marginBottom: 12 }}>
          <div>
            <div className="card-title">Pipeline progress</div>
            <div className="card-sub">Currently in {run.currentStage}</div>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}
          >
            {run.progressPct}%
          </div>
        </div>
        <Progress
          value={run.progressPct}
          style={{ height: 8, marginBottom: 14 }}
        />
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
