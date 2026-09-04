'use client';

import { useEffect, useState } from 'react';
import { type ApiError } from 'next/dist/server/api-utils';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

import {
  GetQuestionById,
  UpdateQuestion,
  type QuestionResponse,
  type UpdateQuestionParams,
} from '@/api/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Final Color Definitions (Copied from Create component)
const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';
const PRIMARY_BUTTON_BG = `bg-[${ACCENT_GREEN}]`;
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;
const BUTTON_TEXT_COLOR = 'text-black';
const DELETE_COLOR = 'text-red-500';
const DELETE_HOVER_BG = 'hover:bg-red-900/40';

// Helper components for design consistency
const ActionButton = ({
  onClick,
  children,
  isDelete = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isDelete?: boolean;
}) => (
  <Button
    type="button"
    onClick={onClick}
    className={`h-9 whitespace-nowrap rounded-md px-3 shadow-md transition-all duration-200 ${
      isDelete
        ? `${DELETE_COLOR} ${DELETE_HOVER_BG} border border-red-500/50 bg-transparent hover:text-red-400`
        : `${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} ${BUTTON_TEXT_COLOR} shadow-[${ACCENT_GREEN}]/50`
    }`}
  >
    {children}
  </Button>
);

const FormLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <Label
    htmlFor={htmlFor}
    className="whitespace-nowrap text-right text-lg font-bold uppercase tracking-wider text-white"
  >
    {children}
  </Label>
);

const CreateButton = () => {
  const params = useParams<{ qid: string }>();

  const router = useRouter();
  const [question, setQuestion] = useState<QuestionResponse>();
  const [description, setDescription] = useState<string>('teri-mummy');

  const [sampleInputs, setSampleInputs] = useState<string[]>(['']);
  const [sampleOutputs, setSampleOutputs] = useState<string[]>(['']);
  const [explanations, setExplanations] = useState<string[]>(['']);
  const [inputFormats, setInputFormats] = useState<string[]>(['']);
  const queryClient = useQueryClient();

  const handleInputChange = (index: number, value: string, type: string) => {
    if (type === 'input') {
      const newInputs = [...sampleInputs];
      newInputs[index] = value;
      setSampleInputs(newInputs);
    } else if (type === 'output') {
      const newOutputs = [...sampleOutputs];
      newOutputs[index] = value;
      setSampleOutputs(newOutputs);
    } else if (type === 'explanation') {
      const newExplanations = [...explanations];
      newExplanations[index] = value;
      setExplanations(newExplanations);
    } else if (type === 'format') {
      const newFormats = [...inputFormats];
      newFormats[index] = value;
      setInputFormats(newFormats);
    }
  };

  const deleteEntry = (index: number, type: string) => {
    if (type === 'input') {
      setSampleInputs(sampleInputs.filter((_, i) => i !== index));
    } else if (type === 'output') {
      setSampleOutputs(sampleOutputs.filter((_, i) => i !== index));
    } else if (type === 'explanation') {
      setExplanations(explanations.filter((_, i) => i !== index));
    } else if (type === 'format') {
      setInputFormats(inputFormats.filter((_, i) => i !== index));
    }
  };

  const { setValue, register, handleSubmit, reset } = useForm<UpdateQuestionParams>();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = await GetQuestionById(params.qid);
        const question = q.question[0];
        if (!question) return;
        setQuestion(question);
        setDescription(question.Description ?? '');

        setExplanations(question.Explanation ?? ['']);
        setInputFormats(question.InputFormat ?? ['']);
        setSampleOutputs(question.SampleTestOutput ?? ['']);
        setSampleInputs(question.SampleTestInput ?? ['']);

        setValue('Title', question.Title ?? '');
        setValue('Description', question.Description ?? '');
        setValue('Points', question.Points ?? 0);
        setValue('Round', question.Round ?? 1);
        setValue('Constraints.0', (question.Constraints ?? []).join('\n'));
        setValue('OutputFormat.0', (question.OutputFormat ?? []).join('\n'));
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    // Lint fix: using void operator for unawaited promise in useEffect
    void fetchQuestion();
  }, [params.qid, setValue]);

  const createQuestion = useMutation({
    mutationFn: (data: UpdateQuestionParams) => {
      data.ID = params.qid;
      data.InputFormat = inputFormats;
      data.Points = +data.Points;
      data.Round = +data.Round;
      data.Constraints = data.Constraints?.[0]?.split('\n') ?? [];
      data.OutputFormat = data.OutputFormat?.[0]?.split('\n') ?? [];
      data.SampleTestInput = sampleInputs;
      data.SampleTestOutput = sampleOutputs;
      data.Explanation = explanations;
      console.log('data', data);
      return toast.promise(UpdateQuestion(data), {
        loading: 'Updating Question',
        success: 'Success!',
        error: (err: ApiError) => err.message || 'Error updating question',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      reset();
      // Lint fix not strictly necessary for router.push, but keep it clean
      router.push('/question');
    },
  });

  const onSubmit = (data: UpdateQuestionParams) => {
    createQuestion.mutate(data);
  };

  const addSampleInput = () => {
    setSampleInputs([...sampleInputs, '']);
  };

  const addSampleOutput = () => {
    setSampleOutputs([...sampleOutputs, '']);
  };

  const addExplanation = () => {
    setExplanations([...explanations, '']);
  };

  const addInputFormat = () => {
    setInputFormats([...inputFormats, '']);
  };

  // Check if data is still loading (initial state + fetch)
  const isLoading = !question && params.qid;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xl text-gray-400">
        Loading question data...
      </div>
    );
  }

  return (
    <div className="m-10 mx-auto max-w-5xl space-y-10 text-white">
      <h1
        className={`flex-grow text-center text-3xl font-extrabold uppercase tracking-widest ${ACCENT_COLOR_TEXT} border-b border-[${ACCENT_GREEN}]/50 pb-2`}
      >
        Edit Question: {question?.Title ?? params.qid}
      </h1>
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            placeholder="OP Question"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
            defaultValue={question?.Title}
            {...register('Title')}
          />
        </div>

        {/* Description (Textarea and Markdown Preview) */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <FormLabel htmlFor="description">Description</FormLabel>
          <div className="col-span-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Textarea
              id="description"
              defaultValue={question?.Description}
              className={`min-h-[300px] w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
              {...register('Description')}
              onChange={e => setDescription(e.target.value)}
              rows={10}
            ></Textarea>
            <div
              className={`w-full border ${ACCENT_COLOR_TEXT} border-[${ACCENT_GREEN}]/50 rounded-md p-4 ${CARD_BG} max-h-[300px] overflow-y-auto`}
            >
              <h3 className={`mb-2 font-bold uppercase ${ACCENT_COLOR_TEXT}`}>Markdown Preview</h3>
              <Markdown className="markdown text-white/90">{description}</Markdown>
            </div>
          </div>
        </div>

        {/* Input Format Section */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="input_format">Input Format</FormLabel>
            <ActionButton onClick={addInputFormat}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {(inputFormats ?? []).map((format, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={format}
                  placeholder="3 integers"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  onChange={e => handleInputChange(index, e.target.value, 'format')}
                  rows={2}
                />
                <ActionButton onClick={() => deleteEntry(index, 'format')} isDelete={true}>
                  <Trash2 size={18} />
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

        {/* Points & Round */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="grid grid-cols-2 items-center gap-4 md:col-span-2">
            <FormLabel htmlFor="points">Points</FormLabel>
            <Input
              id="points"
              type="number"
              placeholder="30"
              className={`border border-gray-700 ${INPUT_BG} text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
              defaultValue={question?.Points}
              {...register('Points')}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4 md:col-span-2">
            <FormLabel htmlFor="round">Round</FormLabel>
            <select
              {...register('Round')}
              defaultValue={question?.Round}
              id="round"
              className={`rounded-md border border-gray-700 ${INPUT_BG} p-2 text-white focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
            >
              <option value={1} className={CARD_BG}>
                Round 1
              </option>
              <option value={2} className={CARD_BG}>
                Round 2
              </option>
              <option value={3} className={CARD_BG}>
                Round 3
              </option>
            </select>
          </div>
        </div>

        {/* Constraints */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="constraints">Constraints</FormLabel>
          <Textarea
            id="constraints"
            placeholder="1 < x < 10"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
            defaultValue={question?.Constraints?.join('\n')}
            {...register('Constraints.0')}
          />
        </div>

        {/* Output Format */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="output_format">Output Format</FormLabel>
          <Textarea
            id="output_format"
            placeholder="Number"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
            defaultValue={question?.OutputFormat?.join('\n')}
            {...register('OutputFormat.0')}
          />
        </div>

        {/* Sample Test Output Section */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_test_output">Sample Output</FormLabel>
            <ActionButton onClick={addSampleOutput}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {sampleOutputs.map((output, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={output}
                  placeholder="Number"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  onChange={e => handleInputChange(index, e.target.value, 'output')}
                  rows={3}
                />
                <ActionButton onClick={() => deleteEntry(index, 'output')} isDelete={true}>
                  <Trash2 size={18} />
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Test Input Section */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_test_input">Sample Input</FormLabel>
            <ActionButton onClick={addSampleInput}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {sampleInputs.map((input, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={input}
                  placeholder="Input"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  onChange={e => handleInputChange(index, e.target.value, 'input')}
                  rows={3}
                />
                <ActionButton onClick={() => deleteEntry(index, 'input')} isDelete={true}>
                  <Trash2 size={18} />
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Explanation Section */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_explanation">Explanation</FormLabel>
            <ActionButton onClick={addExplanation}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {explanations.map((explanation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={explanation}
                  placeholder="Explanation"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] focus:ring-1 focus:ring-[${ACCENT_GREEN}]`}
                  onChange={e => handleInputChange(index, e.target.value, 'explanation')}
                  rows={3}
                />
                <ActionButton onClick={() => deleteEntry(index, 'explanation')} isDelete={true}>
                  <Trash2 size={18} />
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

        <Button
          className={`h-10 rounded-md px-6 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} shadow-[${ACCENT_GREEN}]/50 ml-auto flex`}
          type="submit"
          disabled={createQuestion.isPending}
        >
          {createQuestion.isPending ? 'Submitting...' : 'Update Question'}
        </Button>
      </form>
    </div>
  );
};

export default CreateButton;
