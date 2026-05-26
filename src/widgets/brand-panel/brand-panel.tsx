interface IBrandStat {
  value: string;
  label: string;
}

const STATS: IBrandStat[] = [
  { value: '600', label: 'Universe' },
  { value: '15', label: 'Fields / company' },
  { value: '3y', label: 'History' },
];

export const BrandPanel = () => (
  <div className="signin-left">
    <div className="relative z-[1] flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm font-bold backdrop-blur">
        IB
      </div>
      <div>
        <div className="text-base font-semibold leading-tight">Iron Blue</div>
        <div className="text-xs leading-tight text-white/65">
          Equity Research Platform
        </div>
      </div>
    </div>

    <div className="relative z-[1] max-w-[460px]">
      <div className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#A8C4F0]">
        STOXX 600 Coverage
      </div>
      <h2 className="m-0 mb-4 text-[38px] font-semibold leading-[1.15] tracking-[-0.02em]">
        From annual report to scored workbook — without the manual work.
      </h2>
      <p className="m-0 text-[15px] leading-[1.55] text-white/75">
        Iron Blue ingests the live STOXX 600 universe, screens it against your
        house rules, retrieves and parses 3-year annual reports, and populates
        your scoring template — flagging only the rows that need a human eye.
      </p>
      <div className="mt-8 flex gap-6 [font-variant-numeric:tabular-nums]">
        {STATS.map(stat => (
          <div key={stat.label}>
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="text-xs text-white/60">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-[1] text-xs text-white/55">
      © 2026 Iron Blue Capital · Confidential
    </div>
  </div>
);
