import { Problem } from "./problems";
import { User } from "./user";

export interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentProblems: Problem[];
    assignmentStartTime: string;
    assignmentEndTime: string;
    assignmentDescription: string;
    assignmentUsers: User[];
    assignmentTeamLeaderboard: Teams[]
}

export interface Teams {
    teamName: string;
    teamMembers: User[];
    teamScore: number;
}