import { type LeaderBoardUser } from './adminDashboard';
import { type QuestionResponse } from './questions';

const generateSampleData = (): QuestionResponse[] => {
  const sampleQuestions: QuestionResponse[] = [];

  for (let i = 1; i <= 100; i++) {
    sampleQuestions.push({
      ID: `Q${i}`,
      Description: `Description for question ${i}. This question involves understanding the problem and providing a solution.`,
      Title: `Sample Question ${i}`,
      Qtype: `Type${Math.floor(Math.random() * 3) + 1}`, // Random question type
      Isbountyactive: Math.random() > 0.5, // Random boolean for bounty active status
      InputFormat: [`Input format for question ${i}.`],
      Points: Math.floor(Math.random() * 20) + 1, // Random points between 1 and 20
      Round: Math.floor(Math.random() * 3) + 1, // Random round between 1 and 3
      Constraints: [`Constraint 1 for question ${i}`, `Constraint 2 for question ${i}`],
      OutputFormat: [`Output format for question ${i}.`],
      SampleTestInput: [`Sample input for question ${i}.`],
      SampleTestOutput: [`Expected output for question ${i}.`],
      Explanation: [`Explanation for the solution of question ${i}.`],
    });
  }

  return sampleQuestions;
};
const generateSampleLeaderboard = (): LeaderBoardUser[] => {
  const students = [
    {
      ID: '01922f1a-0ff4-71b6-aee4-b6b69f41c4ce',
      Name: 'Vedant Matanhelia',
      Score: 85,
    },
    {
      ID: '01922fc8-5e18-7c90-89ee-5f2f3e1012c8',
      Name: 'InRandomOrder',
      Score: 100000,
    },
    {
      ID: '01922f0d-010d-7d08-ad02-2383b0dbccff',
      Name: 'Heet Jatania',
      Score: 88,
    },
    {
      ID: '01922f0d-9fe9-7534-8e63-712ca4fc226d',
      Name: 'Vaibhav Jangid',
      Score: 80,
    },
    {
      ID: '01922f0e-0ff4-7d6e-964b-7c708d016d50',
      Name: 'Yashita Puri',
      Score: 76,
    },
    {
      ID: '01922f0e-902b-7d1d-8773-a2007366c77d',
      Name: 'Nishant Gupta',
      Score: 89,
    },
    {
      ID: '01922f0f-4fb1-7748-9d00-9465d66b989e',
      Name: 'Prateek Srtivastava',
      Score: 81,
    },
    {
      ID: '01922f0f-a08a-7dec-8cb1-a6a0d0e94bb9',
      Name: 'Samya Mehta',
      Score: 79,
    },
    {
      ID: '01922f10-0834-7a1f-aa11-fbb1ca143ced',
      Name: 'Harshit',
      Score: 68,
    },
    {
      ID: '01922f25-e180-7d90-a7c7-aecbed743a73',
      Name: 'Abhinav Pant',
      Score: null,
    },
    {
      ID: '01922f26-e68e-7672-a554-4c3085f050dc',
      Name: 'Abhinav Ganeshan',
      Score: null,
    },
  ];
  return students;
};
export { generateSampleData, generateSampleLeaderboard };
