'use client';

import { useState } from 'react';
import { type ApiError } from 'next/dist/server/api-utils';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Table } from '@tanstack/react-table';
import { Search, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { SetUserRound, type SetUserRoundProps } from '@/api/users';
import { Input } from '@/components/ui/input';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';
const PRIMARY_BUTTON_BG = `bg-[${ACCENT_GREEN}]`;
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const { register, handleSubmit, setValue, reset, getValues } = useForm<SetUserRoundProps>({
    defaultValues: {
      round: '1',
      user_ids: [],
    },
  });

  const promoteUsers = useMutation({
    mutationFn: (data: SetUserRoundProps) => {
      return SetUserRound(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      setIsOpen(false);
      table.resetRowSelection();
      toast.success('Users successfully promoted!');
    },
    onError: (err: ApiError) => {
      const errorMessage = (err as any)?.message || 'Failed to promote users.';
      console.error('Error occurred while promoting users:', err);
      toast.error(`Error: ${errorMessage}`);
    },
  });

  const OnSubmit = (data: SetUserRoundProps) => {
    const selectedRows = table.getSelectedRowModel().rows;

    const userIds: string[] = selectedRows
      .map((row: any) => row.original.ID)
      .filter((id): id is string => !!id);

    if (userIds.length > 0) {
      toast
        .promise(promoteUsers.mutateAsync({ ...data, user_ids: userIds }), {
          loading: 'Promoting Users...',
          success: 'Success!',
          error: (err: ApiError) => (err as any).message || 'Promotion failed.',
        })
        .catch(error => {
          console.error('Unexpected error during promotion:', error);
        });
    } else {
      console.error('No users selected.');
      toast.error('No users selected for promotion.');
    }
  };

  const handlePromoteSubmit = () => {
    handleSubmit(OnSubmit)().catch(error => {
      console.error('Form submission error:', error);
    });
  };

  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Search all columns..."
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={event => table.setGlobalFilter(event.target.value)}
            className={`h-9 w-full rounded-md border border-gray-700 ${INPUT_BG} pl-9 text-white placeholder-gray-500 transition focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
          />
          <Search
            className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 ${ACCENT_COLOR_TEXT}`}
          />
        </div>

        <div className="hidden sm:block">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              className={`h-9 w-36 rounded-md border border-gray-700 ${INPUT_BG} ${ACCENT_COLOR_TEXT} transition focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
            >
              <SelectValue placeholder={`Per Page ${table.getState().pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent side="bottom" className={`rounded-lg border border-gray-700 ${CARD_BG}`}>
              {[10, 20, 30, 40, 50, 100].map(pageSize => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className={`text-white hover:bg-[${ACCENT_GREEN}]/10 focus:bg-[${ACCENT_GREEN}]/20 cursor-pointer`}
                >
                  Per Page {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pathname.includes('/users') && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={table.getSelectedRowModel().rows.length === 0 || promoteUsers.isPending}
                className={`h-9 rounded-md px-4 font-semibold text-black shadow-md transition-all duration-200 ${
                  table.getSelectedRowModel().rows.length === 0
                    ? 'cursor-not-allowed bg-gray-700 text-gray-400'
                    : `${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} shadow-[${ACCENT_GREEN}]/50`
                }`}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Promote ({table.getSelectedRowModel().rows.length})
              </Button>
            </DialogTrigger>

            <DialogContent
              className={`rounded-xl border border-[${ACCENT_GREEN}]/40 ${CARD_BG} p-6 text-white shadow-2xl`}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-wider text-white">
                  Confirm User Promotion
                </DialogTitle>
                <DialogDescription className="mt-2 text-gray-400">
                  You are promoting {table.getSelectedRowModel().rows.length} user(s). Select the
                  target round below.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-4 pt-4">
                <label htmlFor="round" className="text-sm font-medium text-white">
                  Target Round:
                </label>
                <select
                  {...register('round')}
                  defaultValue={getValues('round')}
                  id="round"
                  className={`flex justify-center rounded-md border border-gray-700 ${INPUT_BG} p-2 text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                >
                  <option value="0" className={CARD_BG}>
                    Round 0
                  </option>
                  <option value="1" className={CARD_BG}>
                    Round 1
                  </option>
                  <option value="2" className={CARD_BG}>
                    Round 2
                  </option>
                  <option value="3" className={CARD_BG}>
                    Round 3
                  </option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-md border border-gray-600 bg-transparent px-4 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handlePromoteSubmit}
                  disabled={promoteUsers.isPending}
                  className={`h-10 rounded-md px-4 font-semibold text-black transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER}`}
                >
                  {promoteUsers.isPending ? 'Processing...' : 'Continue Promotion'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
