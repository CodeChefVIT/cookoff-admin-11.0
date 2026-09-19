'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { EyeOff } from 'lucide-react';

import { type TestCaseResponse } from '@/api/testcases';
import { DataTableColumnHeader } from '@/components/Table/DataTableColumnHeader';
import { DataTableRowActions } from '@/components/Table/DataTableRowActions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import TestcaseDelete from './ModalTestcaseDelete';
import ModalTestcaseUpdate from './ModalTestcaseUpdate';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';

const columnHelper = createColumnHelper<TestCaseResponse>();

export const TestcaseDataColumn = [
  columnHelper.accessor('ID', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <div className={`flex items-center gap-2 font-mono text-white`}>
        {row.original.Hidden && <EyeOff size={16} className={ACCENT_COLOR_TEXT} />}
        {row.getValue('ID')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-left font-mono', displayName: 'ID' },
  }),

  columnHelper.display({
    id: 'input',
    header: 'Input',
    enableSorting: false,
    enableHiding: true,
    meta: { className: 'text-center', displayName: 'Input' },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`border border-gray-700 bg-transparent ${ACCENT_COLOR_TEXT} hover:bg-[${ACCENT_GREEN}]/10 hover:border-[${ACCENT_GREEN}] transition-colors`}
            >
              View Input
            </Button>
          </DialogTrigger>

          <DialogContent
            className={`max-h-[85vh] overflow-y-auto break-words rounded-xl border border-[${ACCENT_GREEN}]/40 ${CARD_BG} p-6 text-white shadow-2xl`}
          >
            <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">
              {row.original.Input}
            </pre>
          </DialogContent>
        </Dialog>
      </div>
    ),
  }),

  columnHelper.accessor('Memory', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Memory" />,
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-center font-mono', displayName: 'Memory' },
  }),

  columnHelper.accessor('Runtime', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Runtime" />,
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-center font-mono', displayName: 'Runtime' },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: true,
    meta: { className: 'text-center', displayName: 'Actions' },
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <DataTableRowActions row={row}>
          <div className="space-y-1">
            <TestcaseDelete id={row.original.ID}>Delete</TestcaseDelete>
            <ModalTestcaseUpdate row={row}>Update</ModalTestcaseUpdate>
          </div>
        </DataTableRowActions>
      </div>
    ),
  }),
] as ColumnDef<TestCaseResponse>[];
