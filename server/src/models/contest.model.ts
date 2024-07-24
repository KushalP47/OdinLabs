import { IProblemStatus } from "./assignment.model";
import { Document, Model, Schema, model } from 'mongoose';

export interface IContestUser {
    contestUserRollNumber: string;
    contestUserCurrentMarks: number;
    contestUsername: string;
    contestUserProblemStatus: IProblemStatus[];
    contestCustomCookie: string;
}

export interface IContest extends Document {
    contestId: number;
    contestName: string;
    contestDescription: string;
    contestProblems: number[];
    contestStartTime: Date;
    contestEndTime: Date;
    contestSection: string;
    contestUsers: IContestUser[];
    createdAt: Date;
    updatedAt: Date;
}

const contestSchema = new Schema({
    contestId: {
        type: Number,
        required: true,
        unique: true
    },
    contestName: {
        type: String,
        required: true
    },
    contestDescription: {
        type: String,
        required: true
    },
    contestProblems: {
        type: [Number],
        required: true
    },
    contestStartTime: {
        type: Date,
        required: true
    },
    contestEndTime: {
        type: Date,
        required: true
    },
    contestSection: {
        type: String,
        required: true
    },
    contestUsers: {
        type: [{
            contestUserRollNumber: {
                type: String,
                required: true
            },
            contestUserCurrentMarks: {
                type: Number,
                required: true
            },
            contestUserProblemStatus: {
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
            contestCustomCookie: {
                type: String,
                default: ""
            }
        }],
        required: true
    }
}, {
    timestamps: true
});

export const Contest: Model<IContest> = model<IContest>('Contest', contestSchema);

