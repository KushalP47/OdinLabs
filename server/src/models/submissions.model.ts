import { Document, model, Model, Schema } from "mongoose";

// Original ISubmission interface remains unchanged
export interface ISubmission extends Document {
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

// Your existing SubmissionResponse interface remains unchanged
export interface SubmissionResponse {
    submissions: {
        time: number;
        memory: number;
        status: {
            description: string;
        };
    }[];
}

interface IUserModel extends Model<ISubmission> { }

const submissionSchema = new Schema({
    submissionId: {
        type: Number,
        required: true,
        unique: true
    },
    sourceCode: {
        type: String,
        required: true
    },
    languageId: {
        type: Number,
        required: true
    },
    problemId: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    testcasesVerdict: {
        type: Array,
        required: true
    }
}, { timestamps: true });

export const Submission: IUserModel = model<ISubmission>("Submission", submissionSchema);