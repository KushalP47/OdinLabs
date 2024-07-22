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
    const now = new Date().toISOString();
    return assignment.assignmentStartTime <= now && assignment.assignmentEndTime >= now;
};

export const isUpcoming = (assignment: Assignment) => {
    const now = new Date().toISOString();
    return assignment.assignmentStartTime > now;
};

export const isCompleted = (assignment: Assignment) => {
    const now = new Date().toISOString();
    return assignment.assignmentEndTime < now;
};

