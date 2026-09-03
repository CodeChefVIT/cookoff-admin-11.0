'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateTestCase, type CreateTestCaseParams } from '@/api/testcases';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';
const PRIMARY_BUTTON_BG = `bg-[${ACCENT_GREEN}]`;
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;
const BUTTON_TEXT_COLOR = 'text-black';

const CreateTestcaseButton = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<CreateTestCaseParams>({
    defaultValues: {
      memory: 0,
      runtime: 0,
      hidden: 'false' as unknown as boolean,
    },
  });

  const createTestCase = useMutation({
    mutationFn: (data: CreateTestCaseParams) => {
      const hidden = typeof data.hidden === 'string' ? data.hidden === 'true' : !!data.hidden;

      const payload = {
        expected_output: data.expected_output,
        input: data.input,
        memory: data.memory ?? 0,
        runtime: data.runtime ?? 0,
        hidden,
        question_id: id,
      };

      console.log('Payload sent to backend:', payload);

      return toast.promise(CreateTestCase(payload), {
        loading: 'Adding Test Case',
        success: 'Test Case added successfully!',
        error: (err: unknown) => (err instanceof Error ? err.message : 'Error creating testcase'),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['testcases', id] });
      reset();
      setIsOpen(false);
    },
    onError: () => {
      console.log('Error occurred while creating test case');
    },
  });

  const onSubmit = (data: CreateTestCaseParams) => {
    createTestCase.mutate(data);
  };

  return (
    <div className="flex">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={`m-1 ml-auto h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} shadow-[${ACCENT_GREEN}]/50`}
          >
            {children}
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`rounded-xl border sm:max-w-[425px] border-[${ACCENT_GREEN}]/40 ${CARD_BG} p-6 text-white shadow-2xl`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT}`}
            >
              Create New Test Case
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add test cases for QID: <span className="font-mono text-white/90">{id}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="input" className="pt-2 text-right text-white">
                  Input
                </Label>
                <Textarea
                  id="input"
                  placeholder="Test case input"
                  className={`col-span-3 min-h-[100px] border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('input', { required: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="expected_output" className="pt-2 text-right text-white">
                  Expected Output
                </Label>
                <Textarea
                  id="expected_output"
                  placeholder="Expected output"
                  className={`col-span-3 min-h-[100px] border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('expected_output', { required: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="memory" className="text-right text-white">
                  Memory (MB)
                </Label>
                <Input
                  id="memory"
                  type="number"
                  placeholder="e.g., 256"
                  className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('memory', { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="runtime" className="text-right text-white">
                  Runtime (s)
                </Label>
                <Input
                  id="runtime"
                  type="number"
                  placeholder="e.g., 1.5"
                  step="any"
                  className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  {...register('runtime', { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hidden" className="text-right text-white">
                  Hidden
                </Label>
                <select
                  {...register('hidden')}
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
                disabled={createTestCase.isPending}
                className={`h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER}`}
              >
                {createTestCase.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTestcaseButton;
