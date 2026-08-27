'use client';

import { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Row } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UpdateTestCase, type TestCaseResponse, type TestCaseUpdateParams } from '@/api/testcases';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';
const PRIMARY_BUTTON_BG = `bg-[${ACCENT_GREEN}]`;
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/10`;
const BUTTON_TEXT_COLOR = 'text-black';

interface ModalTestcaseUpdateProps {
  row: Row<TestCaseResponse>;
  children: React.ReactNode;
}

const ModalTestcaseUpdate = ({ row, children }: ModalTestcaseUpdateProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<TestCaseUpdateParams>({
    defaultValues: {
      Input: row.original.Input,
      ExpectedOutput: row.original.ExpectedOutput,
      Memory: row.original.Memory,
      Runtime: row.original.Runtime,
      Hidden: row.original.Hidden,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TestCaseUpdateParams) => {
      return toast.promise(UpdateTestCase(row.original.ID, data), {
        loading: 'Updating testcase...',
        success: 'Testcase updated successfully!',
        error: (err: unknown) => {
          if (err instanceof Error) return err.message;
          return 'Error updating testcase';
        },
      });
    },
    onSuccess: async () => {
      const questionID = (row.original as any).questionID;
      if (questionID) {
        await queryClient.invalidateQueries({
          queryKey: ['testcases', questionID],
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['testcases'] });
      }

      reset();
      setModalOpen(false);
    },
  });

  const onSubmit = (data: TestCaseUpdateParams) => updateMutation.mutate(data);

  return (
    <div className="flex">
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <div
            className={`w-full cursor-pointer rounded-md p-1 text-left text-sm transition-colors duration-150 ${ACCENT_COLOR_TEXT} ${HOVER_BG}`}
          >
            {children}
          </div>
        </DialogTrigger>

        <DialogContent
          className={`rounded-xl border sm:max-w-[425px] border-[${ACCENT_GREEN}]/40 ${CARD_BG} p-6 text-white shadow-2xl`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT}`}
            >
              Update Test Case
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Editing Test Case ID:{' '}
              <span className="font-mono text-white/90">{row.original.ID}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Input */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="input" className="pt-2 text-right text-white">
                  Input
                </Label>
                <Textarea
                  id="input"
                  placeholder="Test case input"
                  className={`col-span-3 min-h-[80px] border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('Input')}
                />
              </div>

              {/* Expected Output */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="expected_output" className="pt-2 text-right text-white">
                  Expected Output
                </Label>
                <Textarea
                  id="expected_output"
                  placeholder="Expected output"
                  className={`col-span-3 min-h-[80px] border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('ExpectedOutput')}
                />
              </div>

              {/* Memory */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="memory" className="text-right text-white">
                  Memory (MB)
                </Label>
                <Input
                  id="memory"
                  type="number"
                  placeholder="Memory limit"
                  className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('Memory', { valueAsNumber: true })}
                />
              </div>

              {/* Runtime */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="runtime" className="text-right text-white">
                  Runtime (s)
                </Label>
                <Input
                  id="runtime"
                  type="number"
                  placeholder="Runtime limit"
                  step="any"
                  className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('Runtime', { valueAsNumber: true })}
                />
              </div>

              {/* Hidden */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hidden" className="text-right text-white">
                  Hidden
                </Label>
                <select
                  {...register('Hidden', {
                    setValueAs: v => v === 'true',
                  })}
                  id="hidden"
                  className={`col-span-3 rounded-md border border-gray-700 ${INPUT_BG} p-2 text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                >
                  <option value="false" className={CARD_BG}>
                    No (Visible)
                  </option>
                  <option value="true" className={CARD_BG}>
                    Yes (Hidden)
                  </option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className={`h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER}`}
              >
                {updateMutation.isPending ? 'Updating...' : 'Submit Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalTestcaseUpdate;
