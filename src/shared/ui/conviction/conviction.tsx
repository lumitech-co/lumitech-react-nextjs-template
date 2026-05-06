interface IConvictionProps {
  value: number;
}

const HIGH_THRESHOLD = 85;
const MED_THRESHOLD = 60;

const getTier = (value: number): string => {
  if (value >= HIGH_THRESHOLD) {
    return 'high';
  }

  if (value >= MED_THRESHOLD) {
    return 'med';
  }

  return 'low';
};

export const Conviction = ({ value }: IConvictionProps) => {
  const tier = getTier(value);

  return (
    <div className={`conv ${tier}`}>
      <div className="conv-bar">
        <span style={{ width: `${value}%` }} />
      </div>
      <div className="conv-num">{value}%</div>
    </div>
  );
};
