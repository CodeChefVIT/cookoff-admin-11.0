'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import { cx } from 'class-variance-authority';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../ui/tableReact';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';

const ACCENT_GREEN = '#1ba94c';

const CARD_BG = 'bg-[#182319]';
const BORDER_COLOR = `border-[${ACCENT_GREEN}]/30`;
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/20`;
const SELECTED_BG = `bg-[${ACCENT_GREEN}]/30`;
const TEXT_ACCENT = `text-[${ACCENT_GREEN}]`;

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  state: { rowSelection: RowSelectionState };
  enableRowSelection?: boolean;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
}

export function DataTable<TData>({
  columns,
  data,
  enableRowSelection = false,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const pageSize = 10;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: updater => {
      setRowSelection(updater);
      onRowSelectionChange?.(updater);
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`space-y-3 rounded-xl border ${BORDER_COLOR} p-4 ${CARD_BG}`}>
      <DataTableToolbar table={table} />

      <div className="relative overflow-hidden overflow-x-auto rounded-lg">
        <Table className={`w-full border-collapse`}>
          <TableHead className={`bg-[${ACCENT_GREEN}]/10`}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={`border-b ${BORDER_COLOR}`}>
                {headerGroup.headers.map(header => (
                  <TableHeaderCell
                    key={header.id}
                    className={cx(
                      'whitespace-nowrap px-0.5 py-1.5 text-sm font-bold uppercase sm:text-xs',
                      TEXT_ACCENT,
                      header.column.columnDef.meta?.className
                    )}
                  >
                    <div className="px-3 py-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody className="text-white">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={cx(
                    'transition-colors duration-150',
                    row.getIsSelected() ? SELECTED_BG : HOVER_BG
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cx(
                        'relative whitespace-nowrap px-1 py-1.5 text-sm text-white/90 first:w-10',

                        'border-gray-700/50 last:border-r-0',

                        row.getIsSelected() ? SELECTED_BG : '',
                        cell.column.columnDef.meta?.className
                      )}
                    >
                      {index === 0 && row.getIsSelected() && (
                        <div className={`absolute inset-y-0 left-0 w-1 bg-[${ACCENT_GREEN}]`} />
                      )}
                      <div className="px-3 py-1.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} pageSize={table.getState().pagination.pageSize} />
    </div>
  );
}
