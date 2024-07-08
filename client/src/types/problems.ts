export interface Problem {
    problemId: number;
    problemTitle: string;
    problemDescription: string;
    problemTags: string[];
    problemDifficulty: string;
    problemInputFormat: string;
    problemOutputFormat: string;
    problemSampleInput: string;
    problemSampleOutput: string;
    problemNote: string;
    problemConstraints: string;
    problemTestcases: Testcase[];
    problemSolution: string;
    problemIsHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Testcase {
    input: string;
    expectedOutput: string;
}