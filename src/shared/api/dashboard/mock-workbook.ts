import { utils, write, type WorkSheet } from 'xlsx';

import { ICompany } from './types';

const CURRENCY_MAP: Record<string, string> = {
  UK: 'GBP',
  CH: 'CHF',
  US: 'USD',
};
const DEFAULT_CURRENCY = 'EUR';

const getCurrency = (country: string): string =>
  CURRENCY_MAP[country] ?? DEFAULT_CURRENCY;

type MetricRow = [
  label: string,
  tag: 'input' | 'comment' | 'nd',
  fy25: string,
  fy24: string,
  fy23: string,
  note: string,
];

const METRICS: MetricRow[] = [
  ['Revenue', 'input', '43,480', '40,612', '37,890', ''],
  ['Gross Profit', 'input', '32,180', '29,840', '27,420', ''],
  [
    'EBITDA',
    'comment',
    '8,420',
    '7,820',
    '7,210',
    'Operating EBITDA + non-recurring items',
  ],
  ['EBIT', 'input', '6,890', '6,310', '5,820', ''],
  ['Net Income', 'input', '5,420', '4,840', '4,310', ''],
  ['Diluted EPS', 'input', '4.82', '4.30', '3.84', ''],
  ['Total Assets', 'input', '68,420', '62,180', '58,940', ''],
  ['Total Equity', 'input', '32,180', '28,940', '26,810', ''],
  [
    'Total Debt',
    'comment',
    '24,510',
    '22,180',
    '20,420',
    'Sum of current + non-current borrowings',
  ],
  ['Cash & Equivalents', 'input', '8,210', '7,420', '6,810', ''],
  ['Operating Cash Flow', 'input', '9,820', '8,940', '8,210', ''],
  ['CapEx', 'nd', 'ND', '-2,180', '-1,940', ''],
  [
    'Free Cash Flow',
    'input',
    '6,015',
    '5,840',
    '5,210',
    'OCF \u2212 CapEx (FCF not reported directly)',
  ],
];

const HEADER_ROW_OFFSET = 2;
const SCORE_ROW = 16;

const addCommentToCell = (
  worksheet: WorkSheet,
  addr: string,
  text: string,
): void => {
  if (!worksheet[addr]) {
    return;
  }

  worksheet[addr].c = [{ a: 'Iron Blue AI', t: text }];
};

export const buildMockWorkbook = (company: ICompany): ArrayBuffer => {
  const currency = getCurrency(company.country);
  const workbook = utils.book_new();

  const inputsData: (string | number)[][] = [
    [
      company.name,
      `Currency: ${currency} \u00B7 values in millions`,
      '',
      '',
      '',
      '',
    ],
    ['', 'FY2025', 'FY2024', 'FY2023', '3-yr avg', 'AI notes'],
  ];

  METRICS.forEach(([label, , fy25, fy24, fy23, note]) => {
    inputsData.push([label, fy25, fy24, fy23, '', note || '\u2014']);
  });

  inputsData.push(['Iron Blue Score', '7.4', '7.1', '6.8', '', '']);

  const inputsSheet = utils.aoa_to_sheet(inputsData);

  METRICS.forEach(([label, tag], metricIdx) => {
    const rowNum = metricIdx + HEADER_ROW_OFFSET + 1;
    const avgAddr = `E${rowNum}`;

    if (inputsSheet[avgAddr]) {
      inputsSheet[avgAddr].f = `AVERAGE(B${rowNum}:D${rowNum})`;
    } else {
      inputsSheet[avgAddr] = {
        t: 's',
        v: '',
        f: `AVERAGE(B${rowNum}:D${rowNum})`,
      };
    }

    if (tag === 'comment') {
      addCommentToCell(
        inputsSheet,
        `B${rowNum}`,
        `Source: Annual Report 2025, Income Statement \u2014 "${label}"`,
      );
    }
  });

  const scoreAddr = `E${SCORE_ROW}`;

  inputsSheet[scoreAddr] = { t: 's', v: '', f: 'SCORE()' };

  utils.book_append_sheet(workbook, inputsSheet, 'Inputs');

  const scoreData = [
    ['Scoring Model', '', '', ''],
    ['Metric', 'Weight', 'Raw', 'Weighted'],
    ['Revenue growth', '15%', '8.2', '1.23'],
    ['Margin expansion', '20%', '7.4', '1.48'],
    ['ROIC', '15%', '6.9', '1.04'],
    ['FCF yield', '10%', '7.8', '0.78'],
    ['Debt / EBITDA', '10%', '8.1', '0.81'],
    ['ESG score', '10%', '6.5', '0.65'],
    ['Management quality', '10%', '7.2', '0.72'],
    ['Valuation', '10%', '6.8', '0.68'],
  ];

  utils.book_append_sheet(workbook, utils.aoa_to_sheet(scoreData), 'Score');

  const notesData = [
    ['Notes'],
    [''],
    [
      `Workbook generated for ${company.name} by Iron Blue AI extraction pipeline.`,
    ],
    ['Input cells are populated by the system.'],
    ['Formulas and Iron Blue scoring rows are preserved.'],
    ['Source comments are embedded in relevant cells.'],
  ];

  utils.book_append_sheet(workbook, utils.aoa_to_sheet(notesData), 'Notes');

  const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  return buffer as ArrayBuffer;
};
