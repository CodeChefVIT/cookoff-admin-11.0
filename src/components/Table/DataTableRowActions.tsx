'use client';

import { type Row } from '@tanstack/react-table';
import { RiMoreFill } from 'react-icons/ri';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const BORDER_COLOR = `border-[${ACCENT_GREEN}]/40`;
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/10`;
const DESTRUCTIVE_TEXT = 'text-red-500';
const DESTRUCTIVE_HOVER = 'hover:bg-red-900/40';

interface Action<TData> {
  label: string;
  onClick: (row: Row<TData>) => void;
  className?: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  editAction?: Action<TData>;
  destructiveAction?: Action<TData>;
  additionalActions?: Action<TData>[];
  children?: React.ReactNode;
}

export function DataTableRowActions<TData>({
  row,
  editAction,
  destructiveAction,
  additionalActions = [],
  children,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`group aspect-square rounded-full border border-transparent p-1.5 transition-all duration-150 ${HOVER_BG} hover:border-[${ACCENT_GREEN}]/70 data-[state=open]:border-[${ACCENT_GREEN}]/70 data-[state=open]:bg-[${ACCENT_GREEN}]/10`}
        >
          <RiMoreFill
            className={`size-4 shrink-0 text-gray-400 group-hover:${ACCENT_COLOR_TEXT} group-data-[state=open]:${ACCENT_COLOR_TEXT}`}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`min-w-40 rounded-lg border ${BORDER_COLOR} ${CARD_BG} p-1 text-white shadow-2xl`}
      >
        {additionalActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row)}
            className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${HOVER_BG} ${action.className}`}
          >
            {action.label}
          </DropdownMenuItem>
        ))}

        {editAction && (
          <DropdownMenuItem
            onClick={() => editAction.onClick(row)}
            className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${HOVER_BG} ${ACCENT_COLOR_TEXT} ${editAction.className}`}
          >
            {editAction.label}
          </DropdownMenuItem>
        )}

        {destructiveAction && (
          <DropdownMenuItem
            onClick={() => destructiveAction.onClick(row)}
            className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${DESTRUCTIVE_TEXT} ${DESTRUCTIVE_HOVER} ${destructiveAction.className ?? ''}`}
          >
            {destructiveAction.label}
          </DropdownMenuItem>
        )}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
