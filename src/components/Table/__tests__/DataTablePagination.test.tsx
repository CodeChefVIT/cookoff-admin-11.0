import React from 'react';
import type { Table } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataTablePagination } from '../DataTablePagination';

describe('DataTablePagination component', () => {
  const createMockTable = (overrides = {}) => {
    return {
      getFilteredSelectedRowModel: () => ({ rows: [1, 2] }),
      getFilteredRowModel: () => ({ rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),
      getState: () => ({
        pagination: { pageIndex: 0, pageSize: 10 },
      }),
      getPageCount: () => 3,
      getCanPreviousPage: () => true,
      getCanNextPage: () => true,
      setPageIndex: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      setPageSize: vi.fn(),
      resetRowSelection: vi.fn(),
      ...overrides,
    } as unknown as Table<unknown>;
  };

  it('renders row count and range info', () => {
    const table = createMockTable();
    render(<DataTablePagination table={table} pageSize={10} />);

    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(screen.getByText('1-10')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders No results when there are no rows', () => {
    const table = createMockTable({
      getFilteredRowModel: () => ({ rows: [] }),
    });
    render(<DataTablePagination table={table} pageSize={10} />);

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('handles page navigation button clicks', () => {
    const table = createMockTable();
    render(<DataTablePagination table={table} pageSize={10} />);

    const buttons = screen.getAllByRole('button');
    // First, Prev, Next, Last
    fireEvent.click(buttons[0]!);
    expect(table.setPageIndex).toHaveBeenCalledWith(0);
    expect(table.resetRowSelection).toHaveBeenCalled();

    fireEvent.click(buttons[1]!);
    expect(table.previousPage).toHaveBeenCalled();

    fireEvent.click(buttons[2]!);
    expect(table.nextPage).toHaveBeenCalled();

    fireEvent.click(buttons[3]!);
    expect(table.setPageIndex).toHaveBeenCalledWith(2);
  });
});
