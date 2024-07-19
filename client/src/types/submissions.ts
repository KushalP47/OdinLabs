export interface Submission {
    submissionId?: number;
    submissionSourceCode: string;
    submissionLanguageId: number;
    submissionProblemId: number;
    submissionUserRollNumber: string;
    submissionStatus: string;
    submissionTestcasesVerdict: Array<testcaseVerdict>;
    createdAt: string;
    updatedAt: string;
}

export interface testcaseVerdict {
    status: string;
    time: number;
    memory: number;
}

