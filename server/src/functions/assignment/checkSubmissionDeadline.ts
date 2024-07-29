import { Assignment } from '../../models/assignment.model';
export const checkAssignmentSubmissionDeadline = async (assignmentId: number, submissionTime: Date): Promise<boolean> => {
    try {
        // check if the time of submission is within the deadline
        const assignment = await Assignment.findOne({ assignmentId });
        if (!assignment) {
            return false;
        }
        if (assignment.assignmentEndTime < submissionTime) {
            return false;
        }
        return true;
    } catch (Error) {
        return false;
    }
}