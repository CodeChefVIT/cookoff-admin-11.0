import { type Column } from '@tanstack/react-table';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/20`;

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('font-medium text-white/90', className)}>{title}</div>;
  }

  return (
    <div
      onClick={column.getToggleSortingHandler()}
      className={cn(
        'flex items-center space-x-2',

        column.columnDef.enableSorting === true
          ? `cursor-pointer select-none rounded-md p-1 transition-colors duration-150 ${HOVER_BG} ${ACCENT_COLOR_TEXT}`
          : '',

        className
      )}
    >
      <span className="font-semibold">{title}</span>

      {column.getCanSort() ? (
        <div className="flex flex-col justify-center leading-none">
          <RiArrowUpSLine
            className={cn(
              'size-4 transition-opacity duration-150',
              column.getIsSorted() === 'asc'
                ? `${ACCENT_COLOR_TEXT} opacity-100`
                : 'text-white/40 opacity-100'
            )}
            aria-hidden="true"
          />
          <RiArrowDownSLine
            className={cn(
              '-mt-1 size-4 transition-opacity duration-150',
              column.getIsSorted() === 'desc'
                ? `${ACCENT_COLOR_TEXT} opacity-100`
                : 'text-white/40 opacity-100'
            )}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </div>
  );
}
