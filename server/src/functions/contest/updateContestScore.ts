import { Contest, IContestUser } from "../../models/contest.model";
import { IProblemStatus } from "../../models/assignment.model";
import { IContestFunctionResponse } from "../../models/contest.model";

export const updateContestScore = async (contestId: number, userRollNumber: string, problemId: number, marks: number): Promise<IContestFunctionResponse> => {
    try {
        const contest = await Contest.findOne({ contestId });
        if (!contest) {
            return {
                ok: false,
                message: "Contest not found",
            };
        }
        const userIndex = contest.contestUsers.findIndex((contestUser: IContestUser) => contestUser.contestUserRollNumber === userRollNumber);
        if (userIndex === -1) {
            return {
                ok: false,
                message: "User not found in contest",
            };
        }
        const problemIndex = contest.contestUsers[userIndex].contestUserProblemStatus.findIndex((problem: IProblemStatus) => problem.problemId === problemId);
        if (problemIndex === -1) {
            return {
                ok: false,
                message: "Problem not found in contest",
            };
        }
        if (marks > contest.contestUsers[userIndex].contestUserProblemStatus[problemIndex].problemScore) {
            contest.contestUsers[userIndex].contestUserProblemStatus[problemIndex].problemScore = marks;
        }
        let newMarks = 0;
        contest.contestUsers[userIndex].contestUserProblemStatus.forEach((problem: IProblemStatus) => {
            newMarks += problem.problemScore;
        });
        contest.contestUsers[userIndex].contestUserCurrentMarks = newMarks;
        await contest.save();
        return {
            ok: true,
            message: "Contest score updated successfully",
        };
    }
    catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}