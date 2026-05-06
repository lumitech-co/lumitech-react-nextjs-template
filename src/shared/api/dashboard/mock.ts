/* eslint-disable no-magic-numbers */
import {
  IActivityItem,
  IArchivedRun,
  ICompany,
  IRun,
  IScreeningRules,
  ISummaryRow,
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
  },
];

const STOXX_COMPANIES: ICompany[] = RAW_COMPANIES.map(
  ([name, sector, country, weight, mcap, stage, conviction], index) => ({
    id: `co-${index + 1}`,
    name,
    sector,
    country,
    weight,
    mcap,
    stage,
    conviction,
    manuallyAdded: false,
  }),
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
  },
  {
    id: '2025-Q4',
    label: 'Run #2025-Q4',
    period: 'Oct 12 – Oct 15, 2025',
    companies: 38,
    conviction: 81,
    flags: 7,
  },
  {
    id: '2025-Q3',
    label: 'Run #2025-Q3',
    period: 'Jul 14 – Jul 17, 2025',
    companies: 36,
    conviction: 78,
    flags: 11,
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

export const SUPERSECTORS = [
  'Technology',
  'Health Care',
  'Industrial Goods & Services',
  'Personal & Household Goods',
  'Food, Beverage & Tobacco',
  'Consumer Products & Services',
  'Telecommunications',
  'Utilities',
  'Construction & Materials',
  'Chemicals',
  'Automobiles & Parts',
  'Travel & Leisure',
  'Retail',
  'Media',
  'Oil & Gas',
  'Basic Resources',
  'Banks',
  'Insurance',
  'Real Estate',
  'Financial Services',
];

export const DEFAULT_SCREENING: IScreeningRules = {
  excludedSectors: [...EXCLUDED_SECTORS],
  minMcap: 2.0,
  threshold: 90,
};

export { EXCLUDED_SECTORS };
