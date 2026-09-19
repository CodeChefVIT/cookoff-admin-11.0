'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { type ApiError } from '@/api/errors';
import { GetQuestionById, UpdateQuestion, type QuestionResponse } from '@/api/questions';

import { QuestionForm, type CreateQuestionPayload } from '../QuestionForm';

const EditQuestion = () => {
  const params = useParams<{ qid: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState<QuestionResponse>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = await GetQuestionById(params.qid);
        setQuestion(q);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load question');
      }
    };
    void fetchQuestion();
  }, [params.qid]);

  const updateQuestion = useMutation({
    mutationFn: (data: CreateQuestionPayload) =>
      toast.promise(
        UpdateQuestion({
          ...data,
          ID: params.qid,
          Isbountyactive: question?.Isbountyactive ?? false,
        }),
        {
          loading: 'Updating Question',
          success: 'Success!',
          error: (err: ApiError) => err.message || 'Error updating question',
        }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      router.push('/question');
    },
  });

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-xl text-red-400">{error}</div>
    );
  }

  if (!question) {
    return (
      <div className="flex h-64 items-center justify-center text-xl text-gray-400">
        Loading question data...
      </div>
    );
  }

  return (
    <QuestionForm
      title={`Edit Question: ${question.Title ?? params.qid}`}
      initialValues={{
        title: question.Title,
        description: question.Description,
        round: question.Round,
        points: question.Points,
        constraints: question.Constraints ?? undefined,
        outputFormat: question.OutputFormat,
        buyIn: question.BuyIn,
        reward: question.Reward,
        sampleInputs: question.SampleTestInput,
        sampleOutputs: question.SampleTestOutput,
        explanations: question.Explanation,
        inputFormats: question.InputFormat,
        scratchBlocks: question.ScratchBlocks,
        solutions: question.Solutions,
        solutionPoints: question.SolutionPoints,
      }}
      onSubmit={data => updateQuestion.mutate(data)}
      isPending={updateQuestion.isPending}
      submitLabel="Update Question"
    />
  );
};

export default EditQuestion;
