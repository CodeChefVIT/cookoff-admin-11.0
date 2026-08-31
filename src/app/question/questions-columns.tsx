import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/Table/DataTableColumnHeader';
import { DataTableRowActions } from '@/components/Table/DataTableRowActions';
import { Button } from '@/components/ui/button';

import ModalDelete from './ModalDelete';
import ModalGetTestcase from './ModalGetTestcase';
import ModalUpdate from './ModalUpdate';
import ModalDetails from './ModalView';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const PRIMARY_BUTTON_BG = `bg-[${ACCENT_GREEN}]`;
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;
const BUTTON_TEXT_COLOR = 'text-black';
const DARK_BG = 'bg-[#182319]';

export interface QuestionsDataProps {
  ID: string;
  Description: string;
  Title: string;
  Isbountyactive: boolean;
  InputFormat: string[];
  Points: number;
  Round: number;
  Constraints: string[] | null;
  OutputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
}

const columnHelper = createColumnHelper<QuestionsDataProps>();

export const QuestionsDataColumn = [
  columnHelper.accessor('Title', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-left', displayName: 'Title' },
  }),
  columnHelper.accessor('Isbountyactive', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bounty Active" />,
    enableSorting: true,
    enableHiding: false,

    cell: ({ getValue }) => (
      <span className={getValue() ? ACCENT_COLOR_TEXT : 'text-white/70'}>
        {getValue() ? 'Yes' : 'No'}
      </span>
    ),
    meta: { className: 'text-left', displayName: 'Bounty Active' },
  }),
  columnHelper.accessor('Points', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Points" />,
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-center font-bold', displayName: 'Points' },
  }),
  columnHelper.accessor('Round', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Round" />,
    enableSorting: true,
    enableHiding: false,
    meta: { className: 'text-center', displayName: 'Round' },
  }),
  columnHelper.display({
    id: 'view-more',
    header: 'View More',
    enableSorting: false,
    enableHiding: true,
    meta: { className: 'text-center', displayName: 'view-more' },
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ModalDetails row={row}>
          <Button
            className={`rounded-md border border-gray-700 px-3 py-1.5 ${DARK_BG} text-white transition-colors duration-150 ${PRIMARY_BUTTON_HOVER} hover:border-[${ACCENT_GREEN}]/70`}
          >
            View More Details
          </Button>
        </ModalDetails>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: true,
    meta: { className: 'text-center', displayName: 'actions' },
    cell: ({ row }) => (
      <DataTableRowActions row={row}>
        <div className="flex flex-col justify-center gap-1">
          <ModalDelete row={row} id={row.original.ID}>
            Delete
          </ModalDelete>
          <ModalUpdate id={row.original.ID}>Update</ModalUpdate>
        </div>
      </DataTableRowActions>
    ),
  }),
  columnHelper.display({
    id: 'test-cases',
    header: 'Test Cases',
    enableSorting: false,
    enableHiding: true,
    meta: { className: 'text-center', displayName: 'test-cases' },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ModalGetTestcase id={row.original.ID}>
          <Button
            className={`rounded-md border border-gray-700 px-3 py-1.5 ${DARK_BG} text-white transition-colors duration-150 ${PRIMARY_BUTTON_HOVER} hover:border-[${ACCENT_GREEN}]/70`}
          >
            Test Case Info
          </Button>
        </ModalGetTestcase>
      </div>
    ),
  }),
] as ColumnDef<QuestionsDataProps>[];
