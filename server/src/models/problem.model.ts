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
    problemEditorialIsHidden: boolean;
    problemIsHidden: boolean;
    problemCppTemplate: string;
    problemCppDriverCode?: string;
    problemJavaTemplate: string;
    problemJavaDriverCode?: string;
    problemPythonTemplate: string;
    problemPythonDriverCode?: string;
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
        enum: ['Easy', 'Medium', 'Hard', 'Very Easy']
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
    problemCppTemplate: {
        type: String,
        default: "// Start writing your C++ solution here\n"
    },
    problemCppDriverCode: {
        type: String,
        default: ""
    },
    problemJavaTemplate: {
        type: String,
        default: "// Start writing your Java solution here\n"
    },
    problemJavaDriverCode: {
        type: String,
        default: ""
    },
    problemPythonTemplate: {
        type: String,
        default: "# Start writing your Python solution here\n"
    },
    problemPythonDriverCode: {
        type: String,
        default: ""
    },
    problemEditorialIsHidden: {
        type: Boolean,
        default: true
    },
    problemIsHidden: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export const Problem: Model<IProblem> = model<IProblem>('Problem', problemSchema);