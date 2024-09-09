import { Assignment } from '../types/assignment';

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

};

export const isOngoing = (assignment: Assignment, serverTime: string) => {
    const now = new Date(serverTime).toISOString();
    return assignment.assignmentStartTime <= now && assignment.assignmentEndTime >= now;
};


export const isUpcoming = (assignment: Assignment, serverTime: string) => {
    const now = new Date(serverTime).toISOString();
    return assignment.assignmentStartTime > now;
};

export const isCompleted = (assignment: Assignment, serverTime: string) => {
    const now = new Date(serverTime).toISOString();
    return assignment.assignmentEndTime < now;
};

import { Contest } from "../types/contest";

export const isOngoingContest = (contest: Contest, serverTime: string): boolean => {
    const now = new Date(serverTime);
    return now >= new Date(contest.contestStartTime) && now <= new Date(contest.contestEndTime);
};

export const isUpcomingContest = (contest: Contest, serverTime: string): boolean => {
    const now = new Date(serverTime);
    return now < new Date(contest.contestStartTime);
};

export const isCompletedContest = (contest: Contest, serverTime: string): boolean => {
    const now = new Date(serverTime);
    return now > new Date(contest.contestEndTime);
};


