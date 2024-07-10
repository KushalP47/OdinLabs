import { Schema } from "mongoose";

export interface Submission {
    submissionId: number;
    sourceCode: string;
    languageId: number;
    problemId: number;
    userId: string;
    status: string;
    testcasesVerdict: Array<testcaseVerdict>;
    createdAt: string;
    updatedAt: string;
}


export interface testcaseVerdict {
    status: string;
    time: number;
    memory: number;
}


const submissionSchema = new Schema({
    submissionId: {
        type: Number,
        require: true,
        unique: true
    },
})

export interface SubmissionResponse {
    submissions: {
        time: number;
        memory: number;
        status: {
            description: string;
        };
    }[];
}