'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Row } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { banUser, unbanUser, type User } from '@/api/users';
import { Button } from '@/components/ui/button';

const ACCENT_GREEN = '#1ba94c';
const RED_BG = 'bg-red-600';
const RED_HOVER = 'hover:bg-red-500';
const GREEN_BG = `bg-[${ACCENT_GREEN}]`;
const GREEN_HOVER = `hover:bg-[#15803d]`;
const BUTTON_TEXT_COLOR = 'text-white';
const DARK_TEXT_COLOR = 'text-black';
const DISABLED_BG = 'bg-gray-700 text-gray-400';

const BanBtn = ({ row }: { row: Row<User> }) => {
  const queryClient = useQueryClient();

  const handleBan = useMutation({
    mutationFn: (id: string) =>
      toast.promise(banUser(id), {
        loading: 'Banning...',
        success: 'User banned successfully',
        error: (err: unknown) => {
          if (err instanceof Error) return err.message;
          return 'Error banning user';
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleUnban = useMutation({
    mutationFn: (id: string) =>
      toast.promise(unbanUser(id), {
        loading: 'Unbanning...',
        success: 'User unbanned successfully',
        error: (err: unknown) => {
          if (err instanceof Error) return err.message;
          return 'Error unbanning user';
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const isBanning = handleBan.isPending;
  const isUnbanning = handleUnban.isPending;
  const isDisabled = row.original.Role === 'admin' || isBanning || isUnbanning;

  return (
    <div>
      {row.original.IsBanned ? (
        <Button
          onClick={() => handleUnban.mutate(row.original.ID)}
          disabled={isUnbanning}
          className={`h-8 rounded-md px-3 font-semibold ${DARK_TEXT_COLOR} shadow-md transition-all duration-200 ${GREEN_BG} ${GREEN_HOVER} shadow-[${ACCENT_GREEN}]/50 ${isUnbanning ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          {isUnbanning ? 'Unbanning...' : 'Unban'}
        </Button>
      ) : (
        <Button
          onClick={() => handleBan.mutate(row.original.ID)}
          disabled={isDisabled}
          className={`h-8 rounded-md px-3 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${RED_BG} ${RED_HOVER} shadow-red-700/50 ${isDisabled ? DISABLED_BG : ''}`}
        >
          {isBanning ? 'Banning...' : 'Ban'}
        </Button>
      )}
    </div>
  );
};

export default BanBtn;
