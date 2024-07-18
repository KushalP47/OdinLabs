import { Document, Model, Schema, model } from 'mongoose';

export interface IProblemStatus {
    problemId: number;
    problemScore: number;
}

export interface IAssignmentUser {
    assignmentUserRollNumber: string;
    assignmentUserCurrentMarks: number;
    assigmentUserProblemStatus: IProblemStatus[];
    assignmentUserTeamName: string;
}

export interface IAssignment extends Document {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    assignmentProblems: number[];
    assignmentStartTime: Date;
    assignmentEndTime: Date;
    assignmentSection: string;
    assignmentUsers: IAssignmentUser[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IAssignmentFunctionResponse {
    ok: boolean;
    message: string;
    assignment?: IAssignment;
    assignments?: IAssignment[];
}

const assignmentSchema = new Schema({
    assignmentId: {
        type: Number,
        required: true,
        unique: true
    },
    assignmentName: {
        type: String,
        required: true
    },
    assignmentDescription: {
        type: String,
        required: true
    },
    assignmentProblems: {
        type: [Number],
        required: true
    },
    assignmentStartTime: {
        type: Date,
        required: true
    },
    assignmentEndTime: {
        type: Date,
        required: true
    },
    assignmentSection: {
        type: String,
        required: true
    },
    assignmentUsers: {
        type: [{
            assignmentUserRollNumber: {
                type: String,
                required: true
            },
            assignmentUserCurrentMarks: {
                type: Number,
                required: true
            },
            assigmentUserProblemStatus: {
                type: [{
                    problemId: {
                        type: Number,
                        required: true
                    },
                    problemScore: {
                        type: Number,
                        required: true
                    }
                }],
                required: true
            },
            assignmentUserTeamName: {
                type: String,
                required: true
            }
        }],
        required: true
    }
}, { timestamps: true });

export const Assignment: Model<IAssignment> = model<IAssignment>('Assignment', assignmentSchema);
