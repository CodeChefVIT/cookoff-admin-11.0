'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

import { Button } from '../ui/button';
import { DataTable } from './DataTable';

interface ClientTableProps<T> {
  data: T[] | undefined;
  error: Error | null;
  isLoading: boolean;
  columns: ColumnDef<T>[];
  enableRowSelection?: boolean;
  hidePagination?: boolean;
  onRetry?: () => void;
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
}

function ClientTable<T>({
  data,
  error,
  isLoading,
  columns,
  enableRowSelection = false,
  hidePagination = false,
  onRetry,
  onRowSelectionChange,
}: ClientTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-2xl text-[#1ba94c]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-[#182319] p-8 text-center">
        <p className="mb-1 text-lg font-semibold text-white">Failed to load data</p>
        <p className="mb-4 text-sm text-red-400">{error.message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="rounded-md bg-[#1ba94c] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#15803d]"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      enableRowSelection={enableRowSelection}
      hidePagination={hidePagination}
      state={{ rowSelection }}
      onRowSelectionChange={updater => {
        const next = typeof updater === 'function' ? updater(rowSelection) : updater;
        setRowSelection(next);
        onRowSelectionChange?.(next);
      }}
    />
  );
}

export default ClientTable;
