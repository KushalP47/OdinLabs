export interface Submission {
    id: number;
    source_code: string;
    language_id: number;
    problem_id: number;
    user_id: number;
    status: string;
    testcasesVerdict: Array<number>;
    time: number;
    memory: number;
    created_at: string;
    updated_at: string;
}

