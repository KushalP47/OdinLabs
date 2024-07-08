import { Document, Model, Schema, model } from 'mongoose';

export interface IProblem extends Document {
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

export interface IProblemFunctionResponse {
    ok: boolean;
    message: string;
    problem?: IProblem;
    problems?: IProblem[];
}

const problemSchema = new Schema({
    problemId: {
        type: Number,
        required: true,
        unique: true
    },
    problemTitle: {
        type: String,
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    problemTags: {
        type: [String],
        required: true
    },
    problemDifficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    problemInputFormat: {
        type: String,
        required: true
    },
    problemOutputFormat: {
        type: String,
        required: true
    },
    problemSampleInput: {
        type: String,
        required: true
    },
    problemSampleOutput: {
        type: String,
        required: true
    },
    problemNote: {
        type: String,
        required: true
    },
    problemConstraints: {
        type: String,
        required: true
    },
    problemTestcases: {
        type: [{
            input: String,
            expectedOutput: String
        }],
        required: true
    },
    problemSolution: {
        type: String,
        required: true
    },
    problemIsHidden: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export const Problem: Model<IProblem> = model<IProblem>('Problem', problemSchema);