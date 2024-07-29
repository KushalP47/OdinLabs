import { Contest } from "../../models/contest.model";

export const checkContestSubmissionDeadline = async (contestId: number, submissionTime: Date): Promise<boolean> => {
    try {
        // check if the time of submission is within the deadline
        const contest = await Contest.findOne({ contestId });
        if (!contest) {
            return false;
        }
        if (contest.contestEndTime < submissionTime) {
            return false;
        }
        return true;
    } catch (Error) {
        return false;
    }
}