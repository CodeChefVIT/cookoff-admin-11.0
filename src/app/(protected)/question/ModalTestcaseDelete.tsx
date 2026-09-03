'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { DeleteTestCase } from '@/api/testcases';
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

const ACCENT_GREEN = '#1ba94c';
const CARD_BG = 'bg-[#182319]';
const RED_BG = 'bg-red-600';
const RED_HOVER = 'hover:bg-red-500';
const BUTTON_TEXT_COLOR = 'text-white';

interface ModalDeleteProps {
  children: React.ReactNode;
  id: string;
  questionID?: string;
}

const ModalDelete = ({ children, id, questionID }: ModalDeleteProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (testCaseID: string) =>
      toast.promise(DeleteTestCase(testCaseID), {
        loading: 'Deleting Testcase...',
        success: 'Testcase deleted successfully!',
        error: (err: unknown) => {
          if (err instanceof Error) return err.message;
          return 'Error updating testcase';
        },
      }),
    onSuccess: async () => {
      if (questionID) {
        await queryClient.invalidateQueries({
          queryKey: ['testcases', questionID],
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['testcases'] });
      }
    },
    onError: err => {
      console.error('Error deleting test case:', err);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Redesigned Trigger Button to fit within the DataTableRowActions dropdown */}
        <div
          className={`w-full cursor-pointer p-1 text-left text-sm text-red-500 transition-colors duration-150 hover:bg-red-900/40`}
        >
          {children}
        </div>
      </AlertDialogTrigger>

      {/* Redesigned Alert Dialog Content */}
      <AlertDialogContent
        className={`rounded-xl border border-red-700/50 ${CARD_BG} p-6 text-white shadow-2xl`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold uppercase tracking-wider text-red-500">
            Confirm Test Case Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-gray-400">
            This action cannot be undone. This will permanently delete Test Case ID:{' '}
            <span className="font-mono text-white/90">{id}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          {/* Cancel Button (Secondary Style) */}
          <AlertDialogCancel
            className={`h-10 rounded-md border border-gray-600 bg-transparent px-4 text-white transition-colors hover:bg-gray-800`}
          >
            Cancel
          </AlertDialogCancel>

          {/* Continue Button (Destructive Red) */}
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={`h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} ${RED_BG} ${RED_HOVER} shadow-md shadow-red-700/50 transition-colors duration-200`}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDelete;
