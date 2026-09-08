'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface CreateQuestionPayload {
  Title: string;
  Description: string;
  Round: number;
  Points: number;
  Qtype: string;
  Constraints: string[];
  OutputFormat: string[];
  InputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
  ScratchBlocks: string[];
  BuyIn?: number;
  Reward?: number;
}

interface QuestionFormProps {
  title: string;
  initialValues?: {
    title?: string;
    description?: string;
    round?: number;
    points?: number;
    constraints?: string[];
    outputFormat?: string[];
    buyIn?: number;
    reward?: number;
    sampleInputs?: string[];
    sampleOutputs?: string[];
    explanations?: string[];
    inputFormats?: string[];
    scratchBlocks?: string[];
  };
  onSubmit: (data: CreateQuestionPayload) => void;
  isPending: boolean;
  submitLabel: string;
}

const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';
const PRIMARY_BUTTON_BG = 'bg-[#1ba94c]';
const PRIMARY_BUTTON_HOVER = 'hover:bg-[#15803d]';
const BUTTON_TEXT_COLOR = 'text-black';
const DELETE_COLOR = 'text-red-500';
const DELETE_HOVER_BG = 'hover:bg-red-900/40';

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
        : `${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} ${BUTTON_TEXT_COLOR} shadow-[#1ba94c]/50`
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

export function QuestionForm({
  title,
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
}: QuestionFormProps) {
  const { setValue, register, handleSubmit } = useForm<CreateQuestionPayload>();

  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [sampleInputs, setSampleInputs] = useState<string[]>(['']);
  const [sampleOutputs, setSampleOutputs] = useState<string[]>(['']);
  const [explanations, setExplanations] = useState<string[]>(['']);
  const [inputFormats, setInputFormats] = useState<string[]>(['']);
  const [scratchBlocks, setScratchBlocks] = useState<string[]>(['']);
  const [description, setDescription] = useState<string>('');

  // Populate form defaults in edit mode
  useEffect(() => {
    if (!initialValues) return;
    setDescription(initialValues.description ?? '');
    setSampleInputs(initialValues.sampleInputs?.length ? initialValues.sampleInputs : ['']);
    setSampleOutputs(initialValues.sampleOutputs?.length ? initialValues.sampleOutputs : ['']);
    setExplanations(initialValues.explanations?.length ? initialValues.explanations : ['']);
    setInputFormats(initialValues.inputFormats?.length ? initialValues.inputFormats : ['']);
    setScratchBlocks(initialValues.scratchBlocks?.length ? initialValues.scratchBlocks : ['']);
    setSelectedRound(initialValues.round ?? 1);
    setValue('Title', initialValues.title ?? '');
    setValue('Description', initialValues.description ?? '');
    setValue('Points', initialValues.points ?? 0);
    setValue('Round', initialValues.round ?? 1);
    setValue('Constraints.0', (initialValues.constraints ?? []).join('\n'));
    setValue('OutputFormat.0', (initialValues.outputFormat ?? []).join('\n'));
    setValue('BuyIn', initialValues.buyIn);
    setValue('Reward', initialValues.reward);
  }, [initialValues, setValue]);

  const buildPayload = (data: CreateQuestionPayload): CreateQuestionPayload => ({
    Title: data.Title,
    Description: data.Description,
    Points: Number(data.Points),
    Round: Number(data.Round),
    Qtype: Number(data.Round) === 1 ? 'visual' : 'code',
    Constraints: data.Constraints?.[0]?.split('\n').filter(Boolean) ?? [],
    OutputFormat: data.OutputFormat?.[0]?.split('\n').filter(Boolean) ?? [],
    InputFormat: inputFormats.filter(Boolean),
    SampleTestInput: sampleInputs,
    SampleTestOutput: sampleOutputs,
    Explanation: explanations,
    ScratchBlocks: scratchBlocks,
    BuyIn: data.BuyIn ? Number(data.BuyIn) : undefined,
    Reward: data.Reward ? Number(data.Reward) : undefined,
  });

  const handleSubmitForm = (data: CreateQuestionPayload) => {
    onSubmit(buildPayload(data));
  };

  const handleInputChange = (index: number, value: string, type: string) => {
    const updaters = {
      input: setSampleInputs,
      output: setSampleOutputs,
      explanation: setExplanations,
      format: setInputFormats,
      scratch: setScratchBlocks,
    };
    const setter = updaters[type as keyof typeof updaters];
    if (!setter) return;
    setter((prev: string[]) => prev.map((v, i) => (i === index ? value : v)));
  };

  const deleteEntry = (index: number, type: string) => {
    const updaters = {
      input: setSampleInputs,
      output: setSampleOutputs,
      explanation: setExplanations,
      format: setInputFormats,
      scratch: setScratchBlocks,
    };
    const setter = updaters[type as keyof typeof updaters];
    if (!setter) return;
    setter((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const addEntry = (type: string) => {
    const updaters = {
      input: setSampleInputs,
      output: setSampleOutputs,
      explanation: setExplanations,
      format: setInputFormats,
      scratch: setScratchBlocks,
    };
    const setter = updaters[type as keyof typeof updaters];
    if (!setter) return;
    setter((prev: string[]) => [...prev, '']);
  };

  return (
    <div className="m-10 mx-auto max-w-none space-y-10 text-white">
      <h1
        className={`flex-grow text-center text-3xl font-extrabold uppercase tracking-widest ${ACCENT_COLOR_TEXT} border-b border-[#1ba94c]/50 pb-2`}
      >
        {title}
      </h1>

      <form className="space-y-10" onSubmit={handleSubmit(handleSubmitForm)}>
        {/* Round */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="round">Round</FormLabel>
          <select
            {...register('Round')}
            defaultValue={initialValues?.round ?? 1}
            id="round"
            className={`col-span-3 rounded-md border border-gray-700 ${INPUT_BG} p-2 text-white focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
            onChange={e => setSelectedRound(+e.target.value)}
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

        {/* Title */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            placeholder="OP Question"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
            defaultValue={initialValues?.title}
            {...register('Title')}
          />
        </div>

        {/* Description with Markdown preview */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <FormLabel htmlFor="description">Description</FormLabel>
          <div className="col-span-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Textarea
              id="description"
              defaultValue={initialValues?.description}
              className={`min-h-[300px] w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
              {...register('Description')}
              onChange={e => setDescription(e.target.value)}
              rows={10}
            />
            <div
              className={`w-full border ${ACCENT_COLOR_TEXT} rounded-md border-[#1ba94c]/50 p-4 ${CARD_BG} max-h-[300px] overflow-y-auto`}
            >
              <h3 className={`mb-2 font-bold uppercase ${ACCENT_COLOR_TEXT}`}>Markdown Preview</h3>
              <Markdown className="markdown text-white/90">{description}</Markdown>
            </div>
          </div>
        </div>

        {/* Input Format */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="input_format">Input Format</FormLabel>
            <ActionButton onClick={() => addEntry('format')}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {inputFormats.map((format, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={format}
                  placeholder="e.g., A single integer N, followed by N lines..."
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
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

        {/* Points */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="points">Points</FormLabel>
          <Input
            id="points"
            type="number"
            placeholder="30"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
            defaultValue={initialValues?.points}
            {...register('Points')}
          />
        </div>

        {/* Scratch Blocks (Round 1) */}
        {selectedRound === 1 && (
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
            <div className="flex flex-row items-center justify-end gap-2">
              <FormLabel htmlFor="scratch_blocks">Scratch Blocks</FormLabel>
              <ActionButton onClick={() => addEntry('scratch')}>
                <Plus size={16} />
              </ActionButton>
            </div>
            <div className="col-span-3 flex w-full flex-col gap-2">
              {scratchBlocks.map((block, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={block}
                    placeholder="Scratch block content"
                    className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
                    onChange={e => handleInputChange(index, e.target.value, 'scratch')}
                    rows={2}
                  />
                  <ActionButton onClick={() => deleteEntry(index, 'scratch')} isDelete={true}>
                    <Trash2 size={18} />
                  </ActionButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buy In & Reward (Round 2) */}
        {selectedRound === 2 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="grid grid-cols-2 items-center gap-4 md:col-span-2">
              <FormLabel htmlFor="buy_in">Buy In</FormLabel>
              <Input
                id="buy_in"
                type="number"
                placeholder="50"
                className={`border border-gray-700 ${INPUT_BG} text-white focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
                defaultValue={initialValues?.buyIn}
                {...register('BuyIn')}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 md:col-span-2">
              <FormLabel htmlFor="reward">Reward</FormLabel>
              <Input
                id="reward"
                type="number"
                placeholder="100"
                className={`border border-gray-700 ${INPUT_BG} text-white focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
                defaultValue={initialValues?.reward}
                {...register('Reward')}
              />
            </div>
          </div>
        )}

        {/* Constraints */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="constraints">Constraints</FormLabel>
          <Textarea
            id="constraints"
            placeholder="1 < x < 10&#10;1 <= N <= 10^5"
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
            {...register('Constraints.0')}
            rows={3}
          />
        </div>

        {/* Output Format */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <FormLabel htmlFor="output_format">Output Format</FormLabel>
          <Textarea
            id="output_format"
            placeholder="Output a single integer representing the sum."
            className={`col-span-3 border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
            {...register('OutputFormat.0')}
            rows={3}
          />
        </div>

        {/* Sample Input */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_test_input">Sample Input</FormLabel>
            <ActionButton onClick={() => addEntry('input')}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {sampleInputs.map((input, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={input}
                  placeholder="Input"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
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

        {/* Sample Output */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_test_output">Sample Output</FormLabel>
            <ActionButton onClick={() => addEntry('output')}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {sampleOutputs.map((output, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={output}
                  placeholder="Output"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
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

        {/* Explanation */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <FormLabel htmlFor="sample_explanation">Explanation</FormLabel>
            <ActionButton onClick={() => addEntry('explanation')}>
              <Plus size={16} />
            </ActionButton>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-2">
            {explanations.map((explanation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={explanation}
                  placeholder="Explanation"
                  className={`w-full border border-gray-700 ${INPUT_BG} text-white placeholder-gray-500 focus:border-[#1ba94c] focus:ring-1 focus:ring-[#1ba94c]`}
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

        <div className="flex justify-center">
          <Button
            type="submit"
            className={`h-10 rounded-md px-6 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_HOVER} shadow-[#1ba94c]/50`}
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
