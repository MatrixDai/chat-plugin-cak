export interface QuestionData {
  question: string;
}

export interface code {
  code: string;
  file: string;
  func_name: string;
  line_no: number;
  score: number;
}

export interface AnswerData {
  code_list: code[];
}
