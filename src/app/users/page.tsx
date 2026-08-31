'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getUsers, type GetUsersResponse } from '@/api/users';
import ClientTable from '@/components/Table/ClientTable';

import { UserDataColumn } from './user-columns';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const DARK_BG = 'bg-[#0E150F]';

const PAGE_LIMIT = 20;

const Page = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);

  // Fetch users with React Query
  const { data, error, isLoading, isFetching } = useQuery<GetUsersResponse, Error>({
    queryKey: ['users', cursor],
    queryFn: () => getUsers(PAGE_LIMIT, cursor),
    keepPreviousData: true,
  });

  // Handle row selection in the table
  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    if (!data?.users) return;
    const selectedIds = Object.keys(rowSelection)
      .filter(id => rowSelection[id])
      .map(rowIndex => data.users[parseInt(rowIndex)].ID);

    setSelectedUserIds(selectedIds);
  };

  // Handle Next page click
  const handleNextPage = () => {
    if (!data?.next_cursor) return;
    setCursorHistory(prev => [...prev, cursor]);
    setCursor(data.next_cursor ?? undefined);
  };

  // Handle Previous page click
  const handlePrevPage = () => {
    setCursorHistory(prev => {
      const newHistory = [...prev];
      const prevCursor = newHistory.pop();
      setCursor(prevCursor); // if undefined, resets to first page
      return newHistory;
    });
  };

  return (
    <div className={`min-h-screen p-8 text-white ${DARK_BG}`}>
      <h1
        className={`mb-8 pb-3 text-3xl font-extrabold uppercase tracking-widest ${ACCENT_COLOR_TEXT} border-b`}
        style={{ borderColor: `${ACCENT_GREEN}80` }} // 50% opacity
      >
        User Management
      </h1>

      <div className="flex h-full flex-col space-y-6">
        <div className="flex-1">
          <ClientTable
            data={data?.users ?? []}
            error={error ?? null}
            isLoading={isLoading || isFetching}
            columns={UserDataColumn}
            enableRowSelection
            onRowSelectionChange={handleRowSelectionChange}
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={handlePrevPage}
            disabled={cursorHistory.length === 0}
            className="rounded bg-gray-700 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={!data?.next_cursor}
            className="rounded bg-gray-700 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
