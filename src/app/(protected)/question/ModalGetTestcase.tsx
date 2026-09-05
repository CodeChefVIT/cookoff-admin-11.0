'use client';

import { useQuery } from '@tanstack/react-query';

import { getTestCasesByQuestion, type TestCaseResponse } from '@/api/testcases';
import ClientTable from '@/components/Table/ClientTable';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import ModalCreateTestcase from './ModalCreateTestcase';
import { TestcaseDataColumn } from './TestcaseColumns';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';

interface ModalGetTestcaseProps {
  id: string;
  children: React.ReactNode;
}

const ModalGetTestcase = ({ id, children }: ModalGetTestcaseProps) => {
  const { data, error, isLoading } = useQuery<TestCaseResponse[], Error>({
    queryKey: ['testcases', id],
    queryFn: async () => {
      return await getTestCasesByQuestion(id);
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          className={`max-h-[90vh] max-w-[95vw] overflow-y-auto rounded-xl border md:max-w-7xl border-[${ACCENT_GREEN}]/40 ${CARD_BG} p-6 text-white shadow-2xl`}
        >
          <DialogHeader className="mb-4">
            <DialogTitle
              className={`text-2xl font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT}`}
            >
              Test Cases for Question
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              QID: <span className="font-mono text-white/90">{id}</span>
              <CopyButton
                content={id}
                className="ml-2 inline-flex items-center text-gray-400 hover:text-white"
              />
            </DialogDescription>
          </DialogHeader>

          <div className={`p-1`}>
            <ModalCreateTestcase id={id}>+ Create New Test Case</ModalCreateTestcase>

            <div className="mt-6">
              <ClientTable
                data={data ?? []}
                error={error}
                isLoading={isLoading}
                columns={TestcaseDataColumn}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalGetTestcase;
