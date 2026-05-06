'use client';

import { useMemo, useState } from 'react';

import { read, utils, type CellObject, type WorkBook } from 'xlsx';

import { cn } from 'shared/lib';

interface ICellData {
  value: string;
  className: string;
}

interface IXlsxViewerProps {
  data: ArrayBuffer;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LEN = 26;

const encodeCol = (colIndex: number): string => {
  if (colIndex < ALPHABET_LEN) {
    return ALPHABET[colIndex];
  }

  return (
    ALPHABET[Math.floor(colIndex / ALPHABET_LEN) - 1] +
    ALPHABET[colIndex % ALPHABET_LEN]
  );
};

const getCellClass = (cell: CellObject | undefined): string => {
  if (!cell) {
    return 'input-cell';
  }

  if (cell.f) {
    return 'formula-cell';
  }

  if (cell.c && cell.c.length > 0) {
    return 'input-cell has-comment';
  }

  if (typeof cell.v === 'string' && cell.v === 'ND') {
    return 'input-cell nd-cell';
  }

  return 'input-cell';
};

const parseSheet = (
  workbook: WorkBook,
  sheetName: string,
): { rows: ICellData[][]; colCount: number } => {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    return { rows: [], colCount: 0 };
  }

  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  const totalCols = range.e.c + 1;
  const totalRows = range.e.r + 1;
  const result: ICellData[][] = [];

  for (let rowIdx = 0; rowIdx < totalRows; rowIdx += 1) {
    const row: ICellData[] = [];

    for (let colIdx = 0; colIdx < totalCols; colIdx += 1) {
      const addr = utils.encode_cell({ r: rowIdx, c: colIdx });
      const cell = worksheet[addr] as CellObject | undefined;
      const formatted = cell?.w ?? (cell?.v == null ? '' : String(cell.v));

      row.push({ value: formatted, className: getCellClass(cell) });
    }

    result.push(row);
  }

  return { rows: result, colCount: totalCols };
};

export const XlsxViewer = ({ data }: IXlsxViewerProps) => {
  const workbook: WorkBook = useMemo(
    () => read(data, { type: 'array', cellStyles: true }),
    [data],
  );
  const [activeSheet, setActiveSheet] = useState(workbook.SheetNames[0]);

  const { rows, colCount } = useMemo(
    () => parseSheet(workbook, activeSheet),
    [workbook, activeSheet],
  );

  return (
    <div className="xlsx">
      <div className="xlsx-tabs">
        {workbook.SheetNames.map(sheetName => (
          <div
            key={sheetName}
            className={cn('xlsx-tab', activeSheet === sheetName && 'active')}
            onClick={() => setActiveSheet(sheetName)}
          >
            {sheetName}
          </div>
        ))}
      </div>
      <table className="xlsx-grid">
        <thead>
          <tr>
            <th aria-label="Row number" />
            {Array.from({ length: colCount }, (_, colIdx) => (
              <th key={`col-${encodeCol(colIdx)}`}>{encodeCol(colIdx)}</th>
            ))}
          </tr>
        </thead>
        {/* eslint-disable react/no-array-index-key -- grid cells keyed by stable row+col address */}
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={`row-${rowIdx + 1}`}>
              <td className="row-h">{rowIdx + 1}</td>
              {row.map((cell, colIdx) => (
                <td
                  key={`${rowIdx}-${encodeCol(colIdx)}`}
                  className={cell.className}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* eslint-enable react/no-array-index-key */}
      </table>
    </div>
  );
};
