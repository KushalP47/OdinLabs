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

export const isOngoing = (assignment: Assignment) => {
    const now = Date.now();
    return new Date(assignment.assignmentStartTime).getTime() <= now && new Date(assignment.assignmentEndTime).getTime() >= now;
};

export const isUpcoming = (assignment: Assignment) => {
    return new Date(assignment.assignmentStartTime).getTime() > Date.now();
};

export const isCompleted = (assignment: Assignment) => {
    return new Date(assignment.assignmentEndTime).getTime() < Date.now();
};

