export interface Submission {
    id: number;
    source_code: string;
    language_id: number;
    problem_id: number;
    user_id: number;
    status: string;
    testcasesVerdict: Array<testcaseVerdict>;
    created_at: string;
    updated_at: string;
}

export interface testcaseVerdict {
    status: string;
    time: number;
    memory: number;
}

