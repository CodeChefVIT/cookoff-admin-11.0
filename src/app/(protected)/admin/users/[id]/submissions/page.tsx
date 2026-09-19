/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Clock, Hash, User } from 'lucide-react';

import {
  getUserSubmissions,
  type SubmissionWithResultsAndTestcases,
  type UserWithSubmissions,
} from '@/api/submissions';
import { CopyButton } from '@/components/ui/CopyButton';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const DARK_BG = 'bg-[#0E150F]';
const CARD_BG = 'bg-[#182319]';
const CODE_BG = 'bg-[#0F1011]';
const BORDER_COLOR = `border-[${ACCENT_GREEN}]/40`;
const SUCCESS_TINT = 'bg-green-500/10 text-green-400 border-green-700/50';
const FAILURE_TINT = 'bg-red-500/10 text-red-400 border-red-700/50';

const UserSubmissionsPage = () => {
  const params = useParams();
  const userID = params?.id as string;

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery<UserWithSubmissions, Error>({
    queryKey: ['user-submissions', userID],
    queryFn: () => getUserSubmissions(userID),
    enabled: !!userID,
  });

  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithResultsAndTestcases | null>(null);
  const [selectedTestcaseIndex, setSelectedTestcaseIndex] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (userData?.submissions && userData.submissions.length > 0) {
      const firstSubmission = userData.submissions[0] ?? null;
      if (!firstSubmission) return;
      setSelectedSubmission(firstSubmission);
      setSelectedQuestion(firstSubmission.submission.QuestionID);
      setSelectedTestcaseIndex(0);
    }
  }, [userData]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setSelectedTestcaseIndex(0);
  }, [selectedSubmission, selectedQuestion]);

  if (isLoading) return <div className={`p-6 ${DARK_BG} text-white`}>Loading submissions...</div>;
  if (error) return <div className={`p-6 ${DARK_BG} text-red-500`}>Error: {error.message}</div>;

  const { user, submissions } = userData ?? {
    user: { ID: userID, Name: 'Unknown' },
    submissions: [],
  };

  if (!userData || submissions.length === 0) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center ${DARK_BG} p-6 text-white`}
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 ${CARD_BG} p-12 shadow-xl`}
        >
          <AlertTriangle size={48} className="mb-4 text-yellow-500" />
          <h1 className="mb-2 text-3xl font-bold uppercase">No Submissions Found</h1>
          <p className="text-center text-lg text-gray-400">
            It looks like <span className={ACCENT_COLOR_TEXT}>{user.Name}</span> has not submitted
            any code yet.
          </p>
          <p className="mt-2 text-sm text-gray-500">Awaiting their first attempt!</p>
        </div>
      </div>
    );
  }

  const submissionsForSelectedQuestion = submissions.filter(
    s => s.submission.QuestionID === selectedQuestion
  );

  const selectedTestcase = selectedSubmission?.results?.[selectedTestcaseIndex];

  const passedTestCasesCount = selectedSubmission?.submission.TestcasesPassed ?? 0;
  const failedTestCasesCount = selectedSubmission?.submission.TestcasesFailed ?? 0;
  const totalTestCasesCount = passedTestCasesCount + failedTestCasesCount;

  const uniqueQuestionIDs = Array.from(new Set(submissions.map(s => s.submission.QuestionID)));

  const isAccepted = passedTestCasesCount > 0 && failedTestCasesCount === 0;

  return (
    <div className={`flex min-h-screen flex-col ${DARK_BG} p-6 text-white`}>
      {/* Header: Fixed height/content */}
      <div
        id="header-section"
        className={`mb-6 flex flex-col items-start justify-between rounded-xl border sm:flex-row sm:items-center ${BORDER_COLOR} ${CARD_BG} p-6 shadow-xl`}
      >
        <div className="flex items-start space-x-4">
          <User className={ACCENT_COLOR_TEXT} size={32} />
          <div className="flex flex-col">
            <span className={`text-2xl font-extrabold uppercase ${ACCENT_COLOR_TEXT}`}>
              {user.Name}
            </span>
            <div className="flex flex-wrap gap-x-4 text-sm text-gray-400">
              <span>
                Email: <span className="text-white/80">{user.Email}</span>
              </span>
              <span>
                Reg No: <span className="text-white/80">{user.RegNo}</span>
              </span>
              <span>
                Role: <span className="text-white/80">{user.Role}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-6 sm:mt-0">
          <div className="flex flex-col items-end">
            <span className="text-sm uppercase text-gray-400">Total Score</span>
            <span className={`text-2xl font-bold ${ACCENT_COLOR_TEXT}`}>{user.Score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm uppercase text-gray-400">Round Qualified</span>
            <span className={`text-2xl font-bold ${ACCENT_COLOR_TEXT}`}>{user.RoundQualified}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Fixed Height for Scrolling */}
      {/* This container defines the fixed height of the scrollable component page */}
      <div className="flex w-full flex-1 gap-6" style={{ height: '100vh' }}>
        {/* Left Panel: Question and Submission Selector (SCROLL CONTAINER) */}
        {/* Changed `overflow-hidden` to `flex-col` and removed unnecessary `overflow-y-auto` from here */}
        <div
          className={`flex w-[300px] shrink-0 flex-col rounded-xl ${CARD_BG} overflow-hidden border border-gray-700 p-4 shadow-lg`}
        >
          <h3
            className={`mb-2 text-lg font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT} shrink-0`}
          >
            Submission History
          </h3>

          {/* Question Selector (Shrink-0) */}
          <div className="relative mb-4 shrink-0">
            <select
              className={`w-full appearance-none rounded-md border border-gray-700 ${CODE_BG} p-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[${ACCENT_GREEN}] transition`}
              value={selectedQuestion ?? ''}
              onChange={e => {
                const newQuestionID = e.target.value;
                setSelectedQuestion(newQuestionID);
                const firstSubmissionForNewQuestion = submissions.find(
                  s => s.submission.QuestionID === newQuestionID
                );
                setSelectedSubmission(firstSubmissionForNewQuestion ?? null);
              }}
            >
              <option value="" disabled className={CARD_BG}>
                Select a Question
              </option>
              {uniqueQuestionIDs.map((questionID, index) => (
                <option key={questionID} value={questionID} className={`${CARD_BG} text-white`}>
                  {submissions.find(s => s.submission.QuestionID === questionID)?.submission
                    .QuestionTitle ?? `Q${index + 1}`}
                </option>
              ))}
            </select>
            <Hash
              className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${ACCENT_COLOR_TEXT}`}
            />
          </div>

          <p className="mb-1 shrink-0 text-sm text-gray-400">Submissions for this question:</p>

          {/* Submission List (The Scrollable Area) */}
          {/* flex-1 ensures it fills the available vertical space, and overflow-y-auto makes the list scrollable */}
          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
            {submissionsForSelectedQuestion.map(s => {
              const isSelected = selectedSubmission?.submission.ID === s.submission.ID;
              const isSuccess = s.submission.TestcasesFailed === 0;

              return (
                <div
                  key={s.submission.ID}
                  onClick={() => setSelectedSubmission(s)}
                  className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                    isSelected
                      ? `border-green-500/50 bg-green-800/30 shadow-md shadow-green-900/40`
                      : `border-gray-700/50 hover:bg-[${ACCENT_GREEN}]/10`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">
                      <Clock className="mr-2 inline h-4 w-4 text-gray-500" />
                      {new Date(s.submission.SubmissionTime).toLocaleTimeString()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        isSuccess ? 'bg-green-600 text-black' : 'bg-red-600 text-white'
                      }`}
                    >
                      {s.submission.TestcasesPassed ?? 0}/
                      {(s.submission.TestcasesFailed ?? 0) + (s.submission.TestcasesPassed ?? 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Test Case Details (Scrollable) */}
        <div
          className={`flex flex-1 flex-col rounded-xl ${CARD_BG} overflow-hidden border border-gray-700 p-6 shadow-lg`}
          style={{ height: 'fit-content' }}
        >
          {/* Submission Summary Header (Shrink-0) */}
          <div className="mb-4 flex shrink-0 items-center justify-between border-b border-gray-700 pb-3">
            <p
              className={`text-xl font-bold uppercase ${isAccepted ? ACCENT_COLOR_TEXT : 'text-red-500'}`}
            >
              STATUS: {isAccepted ? 'ACCEPTED' : 'FAILED'}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <p className="font-bold text-gray-400">
                TEST CASES:{' '}
                <span className="text-white">
                  {passedTestCasesCount}/{totalTestCasesCount} Passed
                </span>
              </p>
              <p className="font-bold text-gray-400">
                RUNTIME:{' '}
                <span className={`${ACCENT_COLOR_TEXT}`}>
                  {selectedSubmission?.submission.Runtime ?? 0}s
                </span>
              </p>
            </div>
          </div>

          {/* Inner Content: Test Case List and Details (Scrollable) */}
          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Left Column (Test Case List - Scrollable) */}
            <div className="flex w-1/3 shrink-0 flex-col space-y-2 overflow-y-auto pr-2">
              <p className="mb-1 shrink-0 text-sm font-bold uppercase text-gray-400">
                Test Case Results
              </p>
              {selectedSubmission?.results?.map((test, index) => {
                const isTestAccepted = test.Status === 'Accepted';

                return (
                  <div
                    key={test.ID}
                    onClick={() => setSelectedTestcaseIndex(index)}
                    className={`flex cursor-pointer items-center rounded-md border p-3 text-sm font-semibold transition-all duration-200 ${
                      selectedTestcaseIndex === index
                        ? isTestAccepted
                          ? SUCCESS_TINT
                          : FAILURE_TINT
                        : 'border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    TEST CASE {index + 1}
                    <span className="ml-auto">{isTestAccepted ? '✔ Passed' : '✖ Failed'}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column (Test Case Details and Source Code - Scrollable) */}
            <div className="flex w-2/3 flex-col space-y-4 overflow-y-auto">
              {/* Test Case Details (Input/Expected) */}
              <div className={`shrink-0 rounded-md ${CODE_BG} border border-gray-700 p-4 text-sm`}>
                <p className="mb-2 font-bold uppercase text-gray-400">Selected Test Case Details</p>
                <div className="space-y-3">
                  <div>
                    <p className={`font-bold ${ACCENT_COLOR_TEXT}`}>INPUT</p>
                    <pre className="mt-1 w-full overflow-x-auto rounded-sm border border-gray-800 p-2 font-mono text-xs text-white/90">
                      {selectedTestcase?.testcase?.Input ?? 'N/A'}
                    </pre>
                  </div>
                  <div>
                    <p className="font-bold text-red-400">EXPECTED OUTPUT</p>
                    <pre className="mt-1 w-full overflow-x-auto rounded-sm border border-gray-800 p-2 font-mono text-xs text-white/90">
                      {selectedTestcase?.testcase?.ExpectedOutput ?? 'N/A'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Source Code */}
              <div className={`flex-1 rounded-md ${CODE_BG} border border-gray-700 p-4 text-sm`}>
                <p className="mb-2 font-bold uppercase text-gray-400">Source Code</p>
                <div className="w-full overflow-y-auto">
                  <pre className="w-full overflow-x-auto p-2 font-mono text-xs text-white/90">
                    {selectedSubmission?.submission.SourceCode ?? 'No source code available.'}
                  </pre>
                </div>
                <div className="mt-2 flex justify-end">
                  <CopyButton
                    content={selectedSubmission?.submission.SourceCode ?? ''}
                    className={`text-gray-500 hover:text-white`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSubmissionsPage;
