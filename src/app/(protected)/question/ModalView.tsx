'use client';

import { useState } from 'react';
import { type Row } from '@tanstack/react-table';
import { Info, Zap } from 'lucide-react';

import { CopyButton } from '@/components/ui/CopyButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { type QuestionsDataProps } from './questions-columns';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const BORDER_COLOR = `border-[${ACCENT_GREEN}]/40`;
const SUB_CARD_BG = 'bg-[#253026]';

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={`rounded-lg ${SUB_CARD_BG} border border-gray-700 p-4`}>
    <h3 className={`mb-2 text-lg font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT}`}>
      {title}
    </h3>
    {children}
  </div>
);

const ModalDetails = ({
  row,
  children,
}: {
  row: Row<QuestionsDataProps>;
  children: React.ReactNode;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const q = row.original;

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={`max-h-[90vh] overflow-hidden overflow-y-auto break-words rounded-xl border p-0 sm:max-w-4xl lg:max-w-5xl ${BORDER_COLOR} ${CARD_BG} text-white shadow-2xl`}
      >
        {/* Header: Question Title and Status */}
        <div className={`border-b ${BORDER_COLOR} sticky top-0 px-6 py-4 ${CARD_BG} z-10`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-extrabold uppercase ${ACCENT_COLOR_TEXT}`}>{q.Title}</h1>
            <div
              className={`text-lg font-semibold ${q.Isbountyactive ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              {q.Isbountyactive ? (
                <Zap className="mr-1 inline h-5 w-5" />
              ) : (
                <Info className="mr-1 inline h-5 w-5" />
              )}
              {q.Isbountyactive ? 'Bounty Active' : 'Bounty Inactive'}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div className="rounded-md border border-gray-700 bg-black/50 p-3">
              <p className="text-sm uppercase text-gray-400">ID</p>
              <div className="mt-1 flex items-center justify-center space-x-2 font-mono text-white">
                <span>{q.ID}</span>
                <CopyButton content={q.ID} className="text-gray-500 hover:text-white" />
              </div>
            </div>
            <div className="rounded-md border border-gray-700 bg-black/50 p-3">
              <p className="text-sm uppercase text-gray-400">Round</p>
              <p className={`text-xl font-bold ${ACCENT_COLOR_TEXT}`}>{q.Round?.toString()}</p>
            </div>
            <div className="rounded-md border border-gray-700 bg-black/50 p-3">
              <p className="text-sm uppercase text-gray-400">Points</p>
              <p className={`text-xl font-bold ${ACCENT_COLOR_TEXT}`}>{q.Points?.toString()}</p>
            </div>
            <div className="rounded-md border border-gray-700 bg-black/50 p-3">
              <p className="text-sm uppercase text-gray-400">Status</p>
              <p
                className={`text-xl font-bold ${q.Isbountyactive ? ACCENT_COLOR_TEXT : 'text-gray-400'}`}
              >
                {q.Isbountyactive ? 'Live' : 'Idle'}
              </p>
            </div>
          </div>

          {/* Buy In & Reward (Round 2) */}
          {(q.BuyIn !== undefined || q.Reward !== undefined) && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {q.BuyIn !== undefined && (
                <DetailSection title="Buy In">
                  <p className={`text-xl font-bold ${ACCENT_COLOR_TEXT}`}>{q.BuyIn}</p>
                </DetailSection>
              )}
              {q.Reward !== undefined && (
                <DetailSection title="Reward">
                  <p className={`text-xl font-bold ${ACCENT_COLOR_TEXT}`}>{q.Reward}</p>
                </DetailSection>
              )}
            </div>
          )}

          {/* Scratch Blocks (Round 1) */}
          {q.ScratchBlocks?.length ? (
            <DetailSection title="Scratch Blocks">
              <div className="flex flex-col gap-2">
                {q.ScratchBlocks.map((block, index) => (
                  <pre
                    key={index}
                    className="whitespace-pre-wrap break-words rounded-md bg-black/70 p-3 font-mono text-sm text-white/90"
                  >
                    {block || 'N/A'}
                  </pre>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {/* Solutions (Round 1) */}
          {q.Solutions?.length ? (
            <DetailSection title="Valid Solutions">
              <div className="flex flex-col gap-3">
                {q.Solutions.map((solution, solIndex) => (
                  <div key={solIndex} className="flex items-center gap-3 rounded-md bg-black/50 p-2">
                    <span className="text-sm font-bold text-[#1ba94c]">S{solIndex + 1}:</span>
                    <div className="flex flex-wrap gap-1">
                      {solution.map((blockIdx, bIdx) => (
                        <span key={bIdx} className="rounded bg-[#253026] px-2 py-0.5 text-sm text-white">
                          {blockIdx}
                        </span>
                      ))}
                    </div>
                    {q.SolutionPoints?.[solIndex] !== undefined && (
                      <span className="text-sm text-yellow-400">({q.SolutionPoints[solIndex]} pts)</span>
                    )}
                  </div>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {/* Description */}
          <DetailSection title="Description">
            <div className="break-words text-base text-white/80">{q.Description}</div>
          </DetailSection>

          {/* Input/Output Formats & Constraints */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailSection title="Input Format">
              <div className="whitespace-pre-wrap break-words font-mono text-sm text-white/90">
                {q.InputFormat?.join('\n')}
              </div>
            </DetailSection>
            <DetailSection title="Output Format">
              <div className="whitespace-pre-wrap break-words font-mono text-sm text-white/90">
                {q.OutputFormat?.join('\n')}
              </div>
            </DetailSection>
            <div className="md:col-span-2">
              <DetailSection title="Constraints">
                <div className="whitespace-pre-wrap break-words font-mono text-sm text-yellow-400">
                  {q.Constraints?.join('\n') ?? 'No constraints specified.'}
                </div>
              </DetailSection>
            </div>
          </div>

          {/* Sample Test Case */}
          <DetailSection title="Sample Test Case">
            <h4 className="mt-2 font-semibold text-gray-400">Sample Input:</h4>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-black/70 p-3 font-mono text-sm text-white/90">
              {q.SampleTestInput?.join('\n') ?? 'N/A'}
            </pre>

            <h4 className="mt-4 font-semibold text-gray-400">Sample Output:</h4>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-black/70 p-3 font-mono text-sm text-white/90">
              {q.SampleTestOutput?.join('\n') ?? 'N/A'}
            </pre>
          </DetailSection>

          {/* Explanation */}
          <DetailSection title="Explanation">
            <div className="break-words text-base text-white/80">
              {q.Explanation?.join('\n') ?? 'No explanation provided.'}
            </div>
          </DetailSection>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetails;
