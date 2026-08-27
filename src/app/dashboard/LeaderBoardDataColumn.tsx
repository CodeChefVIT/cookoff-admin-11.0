import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

import { type LeaderboardUser } from '@/api/users';
import { DataTableColumnHeader } from '@/components/Table/DataTableColumnHeader';

const columnHelper = createColumnHelper<LeaderboardUser>();

export const LeaderBoardDataColumn = [
  columnHelper.accessor('Name', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: true,
    meta: {
      className: 'text-center',
      displayName: 'Name',
    },
  }),
  columnHelper.accessor('Score', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    enableSorting: true,
    meta: {
      className: 'text-center',
      displayName: 'Score',
    },
  }),
] as ColumnDef<LeaderboardUser>[];
