'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers, type GetUsersResponse } from '@/api/users';
import ClientTable from '@/components/Table/ClientTable';

import { UserDataColumn } from './user-columns';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const DARK_BG = 'bg-[#0E150F]';

const PAGE_LIMIT = 20;

const Page = () => {
  const [, setSelectedUserIds] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);

  // Fetch users with React Query
  const { data, error, isLoading, isFetching, refetch } = useQuery<GetUsersResponse, Error>({
    queryKey: ['users', cursor],
    queryFn: () => getUsers(PAGE_LIMIT, cursor),
    placeholderData: keepPreviousData,
  });

  const pageNumber = cursorHistory.length + 1;

  // Handle row selection in the table
  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    if (!data?.users) return;
    const selectedIds = Object.keys(rowSelection)
      .filter(id => rowSelection[id])
      .flatMap(rowIndex => {
        const user = data.users[parseInt(rowIndex)];
        return user ? [user.ID] : [];
      });

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
    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();
    setCursorHistory(newHistory);
    setCursor(prevCursor); // if undefined, resets to first page
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
            isLoading={isLoading}
            columns={UserDataColumn}
            enableRowSelection
            hidePagination
            onRetry={() => refetch()}
            onRowSelectionChange={handleRowSelectionChange}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevPage}
            disabled={cursorHistory.length === 0}
            className={`rounded-md border border-gray-700 bg-[#182319] px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:border-[#1ba94c] hover:bg-[#1ba94c]/10 ${
              cursorHistory.length === 0 || isFetching
                ? 'cursor-not-allowed opacity-40 hover:border-gray-700 hover:bg-[#182319]'
                : ''
            }`}
          >
            Previous
          </button>

          <span className="text-sm tabular-nums text-gray-500">
            Page <span className="font-medium text-white">{pageNumber}</span>
            {data?.next_cursor && <span className="text-gray-500"> &bull; more pages</span>}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!data?.next_cursor}
            className={`rounded-md border border-gray-700 bg-[#182319] px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:border-[#1ba94c] hover:bg-[#1ba94c]/10 ${
              !data?.next_cursor || isFetching
                ? 'cursor-not-allowed opacity-40 hover:border-gray-700 hover:bg-[#182319]'
                : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
