import { User } from "./user";

export interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentProblems: number[];
    assignmentStartTime: string;
    assignmentEndTime: string;
    assignmentDescription: string;
    assignmentUsers: AssignmentUser[];
}

export interface AssignmentUser {
    assignmentUserRollNumber: string;
    assignmentUserCurrentMarks: number;
    assigmentUserProblemStatus: ProblemStatus[];
    assignmentUserTeamName: string;
}

export interface ProblemStatus {
    problemId: number;
    problemScore: number;
}

export interface Teams {
    teamName: string;
    teamMembers: User[];
    teamScore: number;
}