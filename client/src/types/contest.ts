import { ProblemStatus } from './assignment';
export interface Contest {
    contestId: number;
    contestName: string;
    contestDescription: string;
    contestProblems: number[];
    contestStartTime: string;
    contestEndTime: string;
    contestSection: string;
    contestUsers: ContestUser[];
}

export interface ContestUser {
    contestUserRollNumber: string;
    contestUserCurrentMarks: number;
    contestUserName: string;
    contestUserProblemStatus: ProblemStatus[];
    contestCustomCookie: string;
}

