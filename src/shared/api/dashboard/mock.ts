/* eslint-disable no-magic-numbers */
import { Sector } from 'shared/constants';

import {
  ExcludedReason,
  IActivityItem,
  IArchivedRun,
  ICompany,
  IReport,
  IReviewItem,
  IRun,
  IScreeningRules,
  ISummaryRow,
  ITemplateField,
  IWorkbookRow,
  Stage,
} from './types';

const EXCLUDED_SECTORS = [
  'Oil & Gas',
  'Basic Resources',
  'Banks',
  'Insurance',
  'Real Estate',
  'Financial Services',
];

type CompanyRow = [
  name: string,
  sector: string,
  country: string,
  weight: number,
  mcap: number,
  stage: Stage,
  conviction: number | null,
];

const RAW_COMPANIES: CompanyRow[] = [
  ['ASML Holding', 'Technology', 'NL', 4.32, 278.4, 'done', 97],
  ['Novo Nordisk', 'Health Care', 'DK', 4.18, 412.5, 'done', 94],
  ['LVMH', 'Personal & Household Goods', 'FR', 3.92, 358.1, 'done', 91],
  ['Nestlé', 'Food, Beverage & Tobacco', 'CH', 3.74, 289.6, 'done', 88],
  ['Roche Holding', 'Health Care', 'CH', 3.21, 234.7, 'done', 92],
  ['AstraZeneca', 'Health Care', 'UK', 3.05, 198.3, 'done', 86],
  ['Shell', 'Oil & Gas', 'UK', 2.84, 210.2, 'excluded', null],
  ['SAP', 'Technology', 'DE', 2.71, 176.8, 'extraction', 78],
  [
    'Siemens',
    'Industrial Goods & Services',
    'DE',
    2.55,
    162.1,
    'extraction',
    null,
  ],
  [
    'L\u2019Oréal',
    'Personal & Household Goods',
    'FR',
    2.42,
    221.4,
    'review',
    72,
  ],
  ['Sanofi', 'Health Care', 'FR', 2.31, 134.8, 'done', 89],
  ['Hermès Intl', 'Personal & Household Goods', 'FR', 2.18, 205.3, 'done', 95],
  [
    'Schneider Electric',
    'Industrial Goods & Services',
    'FR',
    2.04,
    118.6,
    'done',
    90,
  ],
  ['TotalEnergies', 'Oil & Gas', 'FR', 1.98, 148.2, 'excluded', null],
  ['BNP Paribas', 'Banks', 'FR', 1.84, 76.4, 'excluded', null],
  ['Allianz', 'Insurance', 'DE', 1.79, 102.1, 'excluded', null],
  ['Diageo', 'Food, Beverage & Tobacco', 'UK', 1.66, 68.7, 'done', 84],
  ['Unilever', 'Personal & Household Goods', 'UK', 1.61, 118.9, 'done', 83],
  ['BASF', 'Chemicals', 'DE', 1.54, 42.3, 'done', 81],
  ['Vinci', 'Construction & Materials', 'FR', 1.41, 58.6, 'review', 68],
  ['Air Liquide', 'Chemicals', 'FR', 1.32, 82.4, 'done', 87],
  ['Adyen', 'Technology', 'NL', 1.21, 38.7, 'done', 90],
  ['Volkswagen', 'Automobiles & Parts', 'DE', 1.18, 46.2, 'extraction', null],
  ['Stellantis', 'Automobiles & Parts', 'NL', 1.12, 52.8, 'done', 79],
  ['Iberdrola', 'Utilities', 'ES', 1.08, 72.4, 'done', 85],
  ['BBVA', 'Banks', 'ES', 1.05, 48.1, 'excluded', null],
  ['Compass Group', 'Travel & Leisure', 'UK', 0.98, 42.6, 'retrieval', null],
  ['Munich Re', 'Insurance', 'DE', 0.94, 58.9, 'excluded', null],
  ['Inditex', 'Retail', 'ES', 0.92, 128.4, 'done', 88],
  ['Kering', 'Personal & Household Goods', 'FR', 0.86, 32.7, 'done', 76],
  [
    'Reckitt Benckiser',
    'Personal & Household Goods',
    'UK',
    0.82,
    42.8,
    'review',
    71,
  ],
  ['Philips', 'Health Care', 'NL', 0.78, 18.4, 'extraction', null],
  ['Heineken', 'Food, Beverage & Tobacco', 'NL', 0.74, 49.2, 'done', 82],
  ['Pernod Ricard', 'Food, Beverage & Tobacco', 'FR', 0.71, 32.6, 'done', 80],
  ['Nokia', 'Technology', 'FI', 0.68, 21.4, 'done', 74],
  ['Ericsson', 'Technology', 'SE', 0.65, 18.9, 'done', 77],
  ['Volvo', 'Industrial Goods & Services', 'SE', 0.61, 38.2, 'done', 83],
  ['Atlas Copco', 'Industrial Goods & Services', 'SE', 0.58, 68.7, 'done', 91],
  ['IMCD', 'Chemicals', 'NL', 0.54, 7.8, 'retrieval', null],
  ['Wolters Kluwer', 'Media', 'NL', 0.51, 38.4, 'done', 89],
  [
    'Edenred',
    'Industrial Goods & Services',
    'FR',
    0.48,
    9.2,
    'retrieval',
    null,
  ],
  ['Carlsberg', 'Food, Beverage & Tobacco', 'DK', 0.44, 18.7, 'done', 81],
  ['DSV', 'Industrial Goods & Services', 'DK', 0.41, 42.8, 'done', 87],
  ['Genmab', 'Health Care', 'DK', 0.38, 24.6, 'done', 85],
];

const MANUAL_COMPANIES: ICompany[] = [
  {
    id: 'co-m-1',
    name: 'Spotify Technology',
    sector: 'Technology',
    country: 'US',
    weight: 0,
    mcap: 5.42,
    stage: 'pending_retrieval',
    conviction: null,
    manuallyAdded: true,
    excluded: false,
    excludedReason: null,
    website: 'spotify.com',
    sourceListing: 'S&P 500',
    reports: [],
  },
  {
    id: 'co-m-2',
    name: 'Rolls-Royce Holdings',
    sector: 'Industrial Goods & Services',
    country: 'UK',
    weight: 0,
    mcap: 4.12,
    stage: 'extraction',
    conviction: null,
    manuallyAdded: true,
    excluded: false,
    excludedReason: null,
    website: 'rolls-royce.com',
    sourceListing: 'FTSE 100',
    reports: [
      { year: 2025, status: 'Retrieved', page: 110 },
      { year: 2024, status: 'Retrieved', page: 105 },
      { year: 2023, status: 'Manually Uploaded', page: 98 },
    ],
  },
  {
    id: 'co-m-3',
    name: 'TSMC',
    sector: 'Technology',
    country: 'TW',
    weight: 0,
    mcap: 6.85,
    stage: 'done',
    conviction: 92,
    manuallyAdded: true,
    excluded: false,
    excludedReason: null,
    website: 'tsmc.com',
    sourceListing: 'NYSE (ADR)',
    reports: [
      { year: 2025, status: 'Retrieved', page: 124 },
      { year: 2024, status: 'Retrieved', page: 118 },
      { year: 2023, status: 'Retrieved', page: 110 },
    ],
  },
];

const COUNTRY_TLD: Record<string, string> = {
  UK: '.co.uk',
  DE: '.de',
  FR: '.fr',
  CH: '.com',
};

const deriveWebsite = (name: string, country: string): string => {
  const slug = name.toLowerCase().replace(/[^a-z]/g, '');
  const tld = COUNTRY_TLD[country] || '.com';

  return `${slug}${tld}`;
};

const getReport2025Status = (index: number): string => {
  if (index % 11 === 0) {
    return 'Not Retrieved';
  }

  if (index % 7 === 0 || index === 5) {
    return 'Not Published';
  }

  if (index === 39) {
    return 'Manually Uploaded';
  }

  return 'Retrieved';
};

const getReport2024Status = (index: number): string => {
  if (index % 17 === 0) {
    return 'Not Retrieved';
  }

  if (index === 9) {
    return 'Not Published';
  }

  return 'Retrieved';
};

const buildReports = (index: number): IReport[] => [
  {
    year: 2025,
    status: getReport2025Status(index),
    page: 87 + (index % 30),
  },
  {
    year: 2024,
    status: getReport2024Status(index),
    page: 92 + (index % 25),
  },
  { year: 2023, status: 'Retrieved', page: 78 + (index % 20) },
  {
    year: 2022,
    status: index % 19 === 0 ? 'Not Retrieved' : 'Retrieved',
    page: 70 + (index % 18),
  },
  {
    year: 2021,
    status: index % 23 === 0 ? 'Not Published' : 'Retrieved',
    page: 65 + (index % 15),
  },
];

const STOXX_COMPANIES: ICompany[] = RAW_COMPANIES.map(
  ([name, sector, country, weight, mcap, stage, conviction], index) => {
    const isExcluded = stage === 'excluded';
    let excludedReason: ExcludedReason = null;

    if (isExcluded) {
      excludedReason = EXCLUDED_SECTORS.includes(sector)
        ? 'excluded_sector'
        : 'below_threshold';
    }

    return {
      id: `co-${index + 1}`,
      name,
      sector,
      country,
      weight,
      mcap,
      stage,
      conviction,
      manuallyAdded: false,
      excluded: isExcluded,
      excludedReason,
      website: deriveWebsite(name, country),
      sourceListing: 'STOXX 600',
      reports: buildReports(index),
    };
  },
);

export const MOCK_COMPANIES: ICompany[] = [
  ...MANUAL_COMPANIES,
  ...STOXX_COMPANIES,
];

export const MOCK_RUN: IRun = {
  status: 'completed',
  startedAt: 'May 04, 2026 · 09:14 UTC',
  completedAt: 'May 04, 2026 · 14:23 UTC',
  progressPct: 100,
  currentStage: 'done',
  totals: {
    universe: 600,
    screened: 187,
    shortlisted: 44,
    processed: 44,
    needsReview: 7,
    missing: 4,
  },
  overallConviction: 84,
  reExtraction: {
    inProgress: true,
    startedAt: 'May 05, 2026 · 14:35 UTC',
    processed: 12,
    total: 44,
  },
};

export const MOCK_ACTIVITY: IActivityItem[] = [
  {
    id: 'a-1',
    iconName: 'sparkle',
    text: 'Extraction completed for ASML Holding',
    time: '2 min ago',
  },
  {
    id: 'a-2',
    iconName: 'alert',
    text: 'Outlier flagged on Vinci · EBIT > Revenue',
    time: '4 min ago',
    tone: 'warning',
  },
  {
    id: 'a-3',
    iconName: 'check',
    text: 'Workbook generated for Hermès Intl',
    time: '6 min ago',
    tone: 'success',
  },
  {
    id: 'a-4',
    iconName: 'upload',
    text: 'Manual report uploaded · Edenred 2024',
    time: '14 min ago',
  },
  {
    id: 'a-5',
    iconName: 'play',
    text: 'Run started by Eleanor Hartwell',
    time: '49 min ago',
  },
];

export const MOCK_ARCHIVED_RUNS: IArchivedRun[] = [
  {
    id: '2026-Q1',
    label: 'Run #2026-Q1',
    period: 'Jan 15 – Jan 18, 2026',
    companies: 41,
    conviction: 79,
    flags: 9,
    status: 'completed',
  },
  {
    id: '2025-Q4',
    label: 'Run #2025-Q4',
    period: 'Oct 12 – Oct 15, 2025',
    companies: 38,
    conviction: 81,
    flags: 7,
    status: 'completed',
  },
  {
    id: '2025-Q3',
    label: 'Run #2025-Q3',
    period: 'Jul 14 – Jul 17, 2025',
    companies: 36,
    conviction: 78,
    flags: 11,
    status: 'completed',
  },
];

export const HISTORICAL_WORKBOOK_ROWS: IWorkbookRow[] = [
  { company: 'Hexagon AB', ric: 'HEXAb.ST', conviction: 92 },
  { company: 'ASML Holding', ric: 'ASML.AS', conviction: 88 },
  { company: 'Hermès International', ric: 'HRMS.PA', conviction: 91 },
  { company: 'Vinci', ric: 'SGEF.PA', conviction: 84 },
  { company: 'L\u2019Oréal', ric: 'OREP.PA', conviction: 89 },
  { company: 'LVMH', ric: 'LVMH.PA', conviction: 86 },
  { company: 'SAP SE', ric: 'SAPG.DE', conviction: 87 },
  { company: 'Nestlé', ric: 'NESN.S', conviction: 85 },
  { company: 'Roche Holding', ric: 'ROG.S', conviction: 90 },
  { company: 'Schneider Electric', ric: 'SCHN.PA', conviction: 83 },
];

export const HISTORICAL_SUMMARY_ROWS: ISummaryRow[] = [
  { company: 'Hexagon AB', ric: 'HEXAb.ST', total: 7.4, conviction: 92 },
  { company: 'ASML Holding', ric: 'ASML.AS', total: 7.8, conviction: 88 },
  {
    company: 'Hermès International',
    ric: 'HRMS.PA',
    total: 7.6,
    conviction: 91,
  },
  { company: 'Vinci', ric: 'SGEF.PA', total: 6.9, conviction: 84 },
  { company: 'L\u2019Oréal', ric: 'OREP.PA', total: 7.5, conviction: 89 },
  { company: 'LVMH', ric: 'LVMH.PA', total: 7.2, conviction: 86 },
  { company: 'SAP SE', ric: 'SAPG.DE', total: 7.3, conviction: 87 },
  { company: 'Nestlé', ric: 'NESN.S', total: 7.1, conviction: 85 },
];

export const SUPERSECTORS = Object.values(Sector);

export const DEFAULT_SCREENING: IScreeningRules = {
  excludedSectors: [...EXCLUDED_SECTORS],
  minMcap: 2.0,
  maxMcap: null,
};

export const MOCK_TEMPLATE_FIELDS: ITemplateField[] = [
  {
    id: 'rev',
    label: 'Revenue',
    section: 'Income Statement',
    synonyms: ['Net Sales', 'Turnover', 'Total Revenue'],
    hint: 'Use top-line group revenue, exclude joint ventures.',
    rules: [
      'Source: Income Statement section of the Annual Report.',
      'Should be a positive number; large year-on-year swings should be reviewed.',
    ],
  },
  {
    id: 'gp',
    label: 'Gross Profit',
    section: 'Income Statement',
    synonyms: ['Gross Margin'],
    hint: '',
    rules: ['Should be \u2264 Revenue. If exceeded, flag as inconsistency.'],
  },
  {
    id: 'ebitda',
    label: 'EBITDA',
    section: 'Income Statement',
    synonyms: ['Operating EBITDA', 'Adjusted EBITDA'],
    hint: 'Prefer reported EBITDA over adjusted unless only adjusted is available.',
    rules: [
      'Should be \u2264 Revenue. If EBITDA exceeds Revenue, flag as Outlier (likely sign or units error).',
    ],
  },
  {
    id: 'ebit',
    label: 'EBIT',
    section: 'Income Statement',
    synonyms: ['Operating Profit', 'Operating Income'],
    hint: '',
    rules: [
      'Should be \u2264 EBITDA. If EBIT exceeds EBITDA, flag as inconsistency.',
      'Should be \u2264 Revenue.',
    ],
  },
  {
    id: 'ni',
    label: 'Net Income',
    section: 'Income Statement',
    synonyms: ['Profit for the year', 'Net Profit', 'Net earnings'],
    hint: 'Attributable to owners of the parent.',
    rules: [
      'Should be \u2264 EBIT in most cases. If Net Income exceeds EBIT, verify (possible one-off gain).',
      'Source: Income Statement, last line attributable to owners of the parent.',
    ],
  },
  {
    id: 'eps',
    label: 'Diluted EPS',
    section: 'Income Statement',
    synonyms: ['EPS diluted'],
    hint: '',
    rules: ['Reported in currency per share, not millions. Do not normalise.'],
  },
  {
    id: 'ta',
    label: 'Total Assets',
    section: 'Balance Sheet',
    synonyms: [],
    hint: '',
    rules: [
      'Source: Consolidated Balance Sheet.',
      'Should equal Total Equity + Total Liabilities.',
    ],
  },
  {
    id: 'te',
    label: 'Total Equity',
    section: 'Balance Sheet',
    synonyms: ['Shareholders Equity', 'Total Stockholders Equity'],
    hint: '',
    rules: [
      'Source: Consolidated Balance Sheet.',
      'Should be a positive number for going concerns. Negative equity should be flagged.',
    ],
  },
  {
    id: 'td',
    label: 'Total Debt',
    section: 'Balance Sheet',
    synonyms: ['Borrowings', 'Interest-bearing debt'],
    hint: 'Sum current + non-current interest-bearing borrowings.',
    rules: [
      'Source: Consolidated Balance Sheet \u2014 Notes to the accounts on borrowings.',
      'Sum of current + non-current interest-bearing borrowings.',
    ],
  },
  {
    id: 'cash',
    label: 'Cash & Equivalents',
    section: 'Balance Sheet',
    synonyms: ['Cash', 'Cash and cash equivalents'],
    hint: '',
    rules: [
      'Source: Consolidated Balance Sheet \u2014 current assets.',
      'Must be a positive number.',
    ],
  },
  {
    id: 'ocf',
    label: 'Operating Cash Flow',
    section: 'Cash Flow',
    synonyms: ['Cash from operations', 'Net cash from operating activities'],
    hint: '',
    rules: [
      'Source: Consolidated/Group Cashflow statement in the Annual Report.',
    ],
  },
  {
    id: 'capex',
    label: 'CapEx',
    section: 'Cash Flow',
    synonyms: ['Capital expenditure', 'Purchases of PP&E'],
    hint: 'Report as negative.',
    rules: [
      'Source: Consolidated/Group Cashflow statement or the Property, plant & equipment note.',
      'CapEx should be reported as a negative value (it is an outflow). If positive, flag as likely sign error.',
    ],
  },
  {
    id: 'fcf',
    label: 'Free Cash Flow',
    section: 'Cash Flow',
    synonyms: ['FCF'],
    hint: 'OCF \u2212 CapEx if not reported directly.',
    rules: [
      'If not reported directly, calculate as Operating Cash Flow \u2212 CapEx.',
    ],
  },
  {
    id: 'div',
    label: 'Dividends Paid',
    section: 'Cash Flow',
    synonyms: ['Dividends to shareholders'],
    hint: '',
    rules: [
      'Source: Consolidated Cashflow statement / Statement of changes in equity.',
      'Reported as a negative value (it is an outflow).',
    ],
  },
  {
    id: 'emp',
    label: 'Employees (FTE)',
    section: 'Operating Metrics',
    synonyms: ['Headcount', 'Total employees'],
    hint: 'Year-end FTE if available.',
    rules: [
      'Source: Annual Report \u2014 typically in the People / Sustainability section.',
      'Reported as a count, not in millions. Do not normalise.',
    ],
  },
];

export const MOCK_REVIEW_ITEMS: IReviewItem[] = [
  {
    id: 'r1',
    company: "L'Or\u00E9al",
    field: 'EBITDA',
    year: 2024,
    value: '8,420',
    currency: 'EUR',
    flag: 'low_confidence',
    reason:
      "AI confidence 78% \u2014 multiple line items match 'Operating EBITDA'",
    page: 142,
    evidence:
      'Operating EBITDA before non-recurring items reached \u20AC8,420m, up 7.9% on a like-for-like basis.',
  },
  {
    id: 'r2',
    company: 'Vinci',
    field: 'EBIT',
    year: 2024,
    value: '7,180',
    currency: 'EUR',
    flag: 'outlier',
    reason: 'EBIT exceeds Revenue check failed',
    page: 88,
    evidence:
      'Operating income from ordinary activities (EBIT) was \u20AC7,180m.',
  },
  {
    id: 'r3',
    company: 'Reckitt Benckiser',
    field: 'Net Income',
    year: 2024,
    value: '1,290',
    currency: 'GBP',
    flag: 'low_confidence',
    reason: 'AI confidence 82% \u2014 adjusted vs reported ambiguity',
    page: 104,
    evidence:
      'Profit attributable to owners of the parent was \u00A31,290m on a reported basis.',
  },
  {
    id: 'r4',
    company: 'SAP',
    field: 'Free Cash Flow',
    year: 2024,
    value: '6,015',
    currency: 'EUR',
    flag: 'low_confidence',
    reason: 'AI confidence 86% \u2014 multiple FCF definitions in MD&A',
    page: 71,
    evidence:
      'Free cash flow amounted to \u20AC6,015m, an increase of \u20AC1.3 billion year-over-year.',
  },
  {
    id: 'r5',
    company: "L'Or\u00E9al",
    field: 'CapEx',
    year: 2024,
    value: '\u2014',
    currency: 'EUR',
    flag: 'missing',
    reason: 'No CapEx line found in cash flow statement',
    page: null,
    evidence: '',
  },
  {
    id: 'r6',
    company: 'Vinci',
    field: 'Total Debt',
    year: 2024,
    value: '24,510',
    currency: 'EUR',
    flag: 'low_confidence',
    reason: 'AI confidence 88%',
    page: 165,
    evidence:
      'Total interest-bearing borrowings stood at \u20AC24,510m at year end.',
  },
  {
    id: 'r7',
    company: 'Reckitt Benckiser',
    field: 'EBITDA',
    year: 2024,
    value: '4,620',
    currency: 'GBP',
    flag: 'outlier',
    reason: 'YoY change > 80% \u2014 verify against prior-year value',
    page: 96,
    evidence:
      'Adjusted EBITDA of \u00A34,620m reflects the disposal of the Infant Formula business.',
  },
];

export { EXCLUDED_SECTORS };
