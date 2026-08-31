export interface ApiResponse {
  message: string;
  data: unknown;
}

export interface User {
  round: number;
  score: number | null;
  username: string;
}

export interface CodeSubmission {
  source_code: string;
  language_id: number;
  question_id: string;
}

export interface SubmissionResponse {
  submission_id: string;
}

export interface CodeEditorProps {
  selectedquestionId: string;
}

export interface Submission {
  title: string;
  description: string | null;
  score: number;
}
export interface dashboard {
  round: number;
  score: number;
  submissions: Record<string, Submission[]>;
  username: string;
}

export interface APIResponse {
  message: string;
  data: dashboard;
}

export interface profileData {
  round: number;
  score: number;
  username: string;
}
