import Link from 'next/dist/client/link';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { FaCrown, FaEye } from 'react-icons/fa6';

import { type User } from '@/api/users';
import { DataTableColumnHeader } from '@/components/Table/DataTableColumnHeader';
import { Checkbox } from '@/components/ui/checkbox';

import BanBtn from './user-ban';

const columnHelper = createColumnHelper<User>();

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';

export const UserDataColumn = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className={`h-4 w-4 translate-y-[2px] rounded-sm border border-gray-500 bg-transparent data-[state=checked]:${ACCENT_COLOR_TEXT} data-[state=checked]:bg-[${ACCENT_GREEN}] data-[state=indeterminate]:${ACCENT_COLOR_TEXT} data-[state=indeterminate]:bg-[${ACCENT_GREEN}] focus-visible:ring-2 focus-visible:ring-[${ACCENT_GREEN}] focus-visible:ring-offset-1 focus-visible:ring-offset-${CARD_BG.slice(3)} `}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  columnHelper.accessor('Name', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.Role === 'admin' && <FaCrown size={16} />}
        {row.getValue('Name')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: 'text-left',
      displayName: 'Name',
    },
  }),
  columnHelper.accessor('RegNo', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="RegNo" />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'RegNo',
    },
  }),
  columnHelper.accessor('Email', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Email',
    },
  }),
  columnHelper.accessor('RoundQualified', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Round" />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Round',
    },
  }),
  columnHelper.display({
    id: 'ban',
    header: 'Ban / Unban',
    enableSorting: false,
    enableHiding: true,
    meta: {
      className: 'text-center',
      displayName: 'Ban / Unban',
    },
    cell: ({ row }) => (
      <div>
        <BanBtn row={row} />
      </div>
    ),
  }),
  columnHelper.display({
    id: 'link',
    header: 'Submissions',
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.ID}/submissions`}
        // Use the Accent Green for the text and hover effect
        className={`${ACCENT_COLOR_TEXT} hover:underline`}
      >
        View <FaEye className="inline" />
      </Link>
    ),
  }),
] as ColumnDef<User>[];
