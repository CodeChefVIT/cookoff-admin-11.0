'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { type ApiError } from '@/api/errors';
import { CreateQuestion } from '@/api/questions';

import { QuestionForm, type CreateQuestionPayload } from './QuestionForm';

const Create = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createQuestion = useMutation({
    mutationFn: (data: CreateQuestionPayload) =>
      toast.promise(CreateQuestion(data), {
        loading: 'Adding Question',
        success: 'Success!',
        error: (err: ApiError) => err.message || 'Error creating question',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      router.push('/question');
    },
  });

  return (
    <QuestionForm
      title="Create New Question"
      onSubmit={data => createQuestion.mutate(data)}
      isPending={createQuestion.isPending}
      submitLabel="Submit Question"
    />
  );
};

export default Create;
