'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { GetAllQuestions, type QuestionResponse } from '@/api/questions';
import ClientTable from '@/components/Table/ClientTable';

import CreateButton from './ModalCreate';
import { QuestionsDataColumn } from './questions-columns';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';

const Page = () => {
  const { data, error, isLoading } = useQuery<QuestionResponse[], Error>({
    queryKey: ['questions'],
    queryFn: GetAllQuestions,
  });

  return (
    <div className={`min-h-screen p-8 text-white`}>
      <h1
        className={`mb-8 pb-3 text-3xl font-extrabold uppercase tracking-widest ${ACCENT_COLOR_TEXT} border-b border-[${ACCENT_GREEN}]/50`}
      >
        Question Management
      </h1>

      <div className="flex h-full flex-col space-y-6">
        <div className="flex items-center justify-end">
          <CreateButton>
            <Plus className="mr-2 h-4 w-4" />
            Create New Question
          </CreateButton>
        </div>

        <div className="flex-1">
          <ClientTable
            data={data}
            error={error}
            isLoading={isLoading}
            columns={QuestionsDataColumn}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
