export interface UpdateQuestionParams {
  id: string;
  description: string;
  title: string;
  input_format: string[];
  points: number;
  round: number;
  constraints: string[];
  output_format: string[];
  sample_test_input: string[];
  sample_test_output: string[];
  sample_explanation: string[];
}

export interface QuestionResponse {
  ID: string;
  Description: string;
  Title: string;
  InputFormat: string[];
  Points: number;
  Round: number;
  Constraints: string[] | null;
  OutputFormat: string[];
  SampleTestInput: string[];
  SampleTestOutput: string[];
  Explanation: string[];
}

export interface CreateQuestionParams {
  description: string;
  title: string;
  input_format: string[];
  points: number;
  round: number;
  constraints: string[];
  output_format: string[];
  sample_test_input: string[];
  sample_test_output: string[];
  sample_explanation: string[];
}

export interface DeleteQuestionResponse {
  message: string;
}
