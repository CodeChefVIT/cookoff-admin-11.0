'use client';

import { type ApiError } from 'next/dist/server/api-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Row } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { DeleteQuestion } from '@/api/questions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { type QuestionsDataProps } from './questions-columns';

const CARD_BG = 'bg-[#182319]';
const RED_BG = 'bg-red-600';
const RED_HOVER = 'hover:bg-red-500';
const BUTTON_TEXT_COLOR = 'text-white';

const ModalDelete = ({
  children,
  id,
}: {
  row: Row<QuestionsDataProps>;
  children: React.ReactNode;
  id: string;
}) => {
  const queryClient = useQueryClient();

  const handleDelete = useMutation({
    mutationFn: (id: string) => {
      return toast.promise(DeleteQuestion(id), {
        loading: 'Deleting Question',
        success: 'Success!',
        error: (err: ApiError) => err.message || 'Error deleting question',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: () => {
      console.log('Error occurred while deleting question');
    },
  });

  const onSubmit = () => {
    handleDelete.mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          className={`w-full cursor-pointer p-1 text-left text-sm ${RED_HOVER} text-red-500 transition-colors duration-150`}
        >
          {children}
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={`rounded-xl border border-red-700/50 ${CARD_BG} p-6 text-white shadow-2xl`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold uppercase tracking-wider text-red-500">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-gray-400">
            This action cannot be undone. This will permanently delete the question and all
            associated data. **Are you absolutely sure?** Dekh lo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel
            className={`h-10 rounded-md border border-gray-600 bg-transparent px-4 text-white transition-colors hover:bg-gray-800`}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onSubmit}
            disabled={handleDelete.isPending}
            className={`h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} ${RED_BG} ${RED_HOVER} shadow-md shadow-red-700/50 transition-colors duration-200`}
          >
            {handleDelete.isPending ? 'Deleting...' : 'Delete Permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDelete;
