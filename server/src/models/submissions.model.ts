import { Document, model, Model, Schema } from "mongoose";

// Original ISubmission interface remains unchanged
export interface ISubmission extends Document {
    submissionId: number;
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
    submissionSourceCode: {
        type: String,
        required: true
    },
    submissionLanguageId: {
        type: Number,
        required: true
    },
    submissionProblemId: {
        type: Number,
        required: true
    },
    submissionUserRollNumber: {
        type: String,
        required: true
    },
    submissionStatus: {
        type: String,
        required: true
    },
    submissionTestcasesVerdict: {
        type: Array,
        required: true
    }
}, { timestamps: true });

export const Submission: IUserModel = model<ISubmission>("Submission", submissionSchema);