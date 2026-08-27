'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { RiLoader2Fill } from 'react-icons/ri';

import { DataTable } from './DataTable';

interface ClientTableProps<T> {
  data: T[] | undefined;
  error: Error | null;
  isLoading: boolean;
  columns: ColumnDef<T>[];
  enableRowSelection?: boolean; // new prop
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void; // callback
}

function ClientTable<T>({
  data,
  error,
  isLoading,
  columns,
  enableRowSelection = false,
  onRowSelectionChange,
}: ClientTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  if (error) return <div>{error.message}</div>;

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <RiLoader2Fill className="animate-spin" />
        </div>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          enableRowSelection={enableRowSelection}
          state={{ rowSelection }}
          onRowSelectionChange={updater => {
            setRowSelection(updater);
            onRowSelectionChange?.(updater);
          }}
        />
      )}
    </>
  );
}

export default ClientTable;
