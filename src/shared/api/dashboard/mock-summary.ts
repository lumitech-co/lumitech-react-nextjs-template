/* eslint-disable no-magic-numbers */
import { utils, write } from 'xlsx';

import { ICompany, IReviewItem } from './types';

const EXCHANGE_MAP: Record<string, string> = {
  UK: 'L',
  DE: 'DE',
  FR: 'PA',
  US: 'N',
};
const DEFAULT_EXCHANGE = 'X';

const CONVICTION_BASE = 60;
const CONVICTION_DIVISOR = 4;
const DEFAULT_CONVICTION = 80;
const SCORE_MIN = 2;
const MAX_COMPANIES = 14;

const deriveRic = (company: ICompany): string => {
  const ticker = company.name.replace(/[^A-Z]/g, '').slice(0, 4) || 'XXX';
  const exchange = EXCHANGE_MAP[company.country] ?? DEFAULT_EXCHANGE;

  return `${ticker}.${exchange}`;
};

const pseudoRandom = (seed: number): number =>
  SCORE_MIN + ((seed * 7 + 3) % 20) / 10;

export const buildMockSummary = (
  companies: ICompany[],
  reviewItems: IReviewItem[],
): ArrayBuffer => {
  const workbook = utils.book_new();
  const done = companies.filter(company => company.stage === 'done');

  const summaryData: (string | number)[][] = [
    [
      '',
      'Company',
      'RIC',
      'Latest year',
      'Score 1',
      'Score 2',
      'Score 3',
      '\u2026',
      'Total',
      'Conviction',
    ],
  ];

  done.slice(0, MAX_COMPANIES).forEach((company, companyIdx) => {
    const conviction = company.conviction ?? DEFAULT_CONVICTION;
    const totalScore = (
      CONVICTION_BASE +
      conviction / CONVICTION_DIVISOR
    ).toFixed(1);

    summaryData.push([
      companyIdx + 2,
      company.name,
      deriveRic(company),
      2025,
      Number(pseudoRandom(companyIdx).toFixed(1)),
      Number(pseudoRandom(companyIdx + 7).toFixed(1)),
      Number(pseudoRandom(companyIdx + 13).toFixed(1)),
      '\u2026',
      Number(totalScore),
      `${conviction}%`,
    ]);
  });

  const summarySheet = utils.aoa_to_sheet(summaryData);

  done.slice(0, MAX_COMPANIES).forEach((_, companyIdx) => {
    const rowNum = companyIdx + 2;

    ['E', 'F', 'G', 'I'].forEach(col => {
      const addr = `${col}${rowNum}`;

      if (summarySheet[addr]) {
        summarySheet[addr].f = `SCORE_${col}(${rowNum})`;
      }
    });
  });

  utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const flagsData: (string | number)[][] = [
    ['Company', 'Field', 'Year', 'Flag', 'Value', 'Reason'],
  ];

  reviewItems.forEach(flagItem => {
    flagsData.push([
      flagItem.company,
      flagItem.field,
      flagItem.year,
      flagItem.flag,
      flagItem.value,
      flagItem.reason,
    ]);
  });

  utils.book_append_sheet(workbook, utils.aoa_to_sheet(flagsData), 'Flags');

  const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  return buffer as ArrayBuffer;
};
