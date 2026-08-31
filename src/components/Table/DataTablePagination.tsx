import { type Table } from '@tanstack/react-table';
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from 'react-icons/ri';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const MUTE_TEXT = 'text-gray-500';
const BUTTON_BG = 'bg-[#182319]';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
}

export function DataTablePagination<TData>({ table, pageSize }: DataTablePaginationProps<TData>) {
  const paginationButtons = [
    {
      icon: RiArrowLeftDoubleLine,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: 'First page',
      mobileView: 'hidden sm:block',
    },
    {
      icon: RiArrowLeftSLine,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      srText: 'Previous page',
      mobileView: '',
    },
    {
      icon: RiArrowRightSLine,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      srText: 'Next page',
      mobileView: '',
    },
    {
      icon: RiArrowRightDoubleLine,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      srText: 'Last page',
      mobileView: 'hidden sm:block',
    },
  ];

  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const firstRowIndex = currentPage * pageSize + 1;
  const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1);

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm tabular-nums text-gray-500"></div>
      <div className="flex w-full items-center justify-between gap-x-4 sm:justify-end lg:gap-x-6">
        <p className={`text-sm tabular-nums ${MUTE_TEXT} flex-1 text-left`}>
          Showing{' '}
          <span className={`font-medium text-white`}>
            {firstRowIndex}-{lastRowIndex}
          </span>{' '}
          of <span className={`font-medium ${ACCENT_COLOR_TEXT}`}>{totalRows}</span>
        </p>

        <div className="flex items-center gap-x-1.5">
          {paginationButtons.map((button, index) => (
            <Button
              key={index}
              className={cn(
                button.mobileView,
                `h-8 w-8 rounded-md border border-gray-700 p-1.5 ${BUTTON_BG} transition-colors duration-150`,

                button.disabled
                  ? 'cursor-not-allowed opacity-40'
                  : `hover:border-[${ACCENT_GREEN}] hover:bg-[${ACCENT_GREEN}]/10`
              )}
              onClick={() => {
                button.onClick();

                table.resetRowSelection();
              }}
              disabled={button.disabled}
            >
              <span className="sr-only">{button.srText}</span>
              <button.icon
                className={cn(
                  'size-5 shrink-0 transition-colors duration-150',

                  button.disabled ? 'text-gray-500' : ACCENT_COLOR_TEXT
                )}
                aria-hidden="true"
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
