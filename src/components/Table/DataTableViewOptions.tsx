'use client';

import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const BORDER_COLOR = `border-[${ACCENT_GREEN}]/40`;
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/20`;

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            `ml-auto hidden h-9 rounded-md border border-gray-700 px-3 lg:flex ${CARD_BG} font-semibold text-white transition-colors duration-200`,
            `hover:bg-[${ACCENT_GREEN}]/10 hover:border-[${ACCENT_GREEN}]`
          )}
        >
          <MixerHorizontalIcon className={`mr-2 h-4 w-4 ${ACCENT_COLOR_TEXT}`} />
          View Options
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`w-[180px] rounded-lg border ${BORDER_COLOR} ${CARD_BG} z-50 p-1 text-white shadow-2xl`}
      >
        <DropdownMenuLabel className="px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-white">
          Toggle Columns
        </DropdownMenuLabel>

        <DropdownMenuSeparator className={`my-1 h-[1px] ${BORDER_COLOR}`} />

        {table
          .getAllColumns()
          .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className={cn(
                  'flex cursor-pointer items-center space-x-2 rounded-md px-3 py-1.5 text-sm capitalize transition-colors duration-150',
                  `hover:text-white ${HOVER_BG} focus:outline-none focus:bg-[${ACCENT_GREEN}]/30`,
                  column.getIsVisible() && ACCENT_COLOR_TEXT
                )}
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
