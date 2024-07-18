import { Assignment, IAssignmentFunctionResponse, IAssignmentUser, IProblemStatus } from "../../models/assignment.model";

export const updateAssignmentScore = async (assignmentId: number, userRollNumber: string, problemId: number, marks: number): Promise<IAssignmentFunctionResponse> => {
    try {
        const assignment = await Assignment.findOne({
            assignmentId
        });
        if (!assignment) {
            return {
                ok: false,
                message: "Assignment not found"
            };
        }
        const userIndex = assignment.assignmentUsers.findIndex((user: IAssignmentUser) => user.assignmentUserRollNumber === userRollNumber);
        if (userIndex === -1) {
            return {
                ok: false,
                message: "User not found"
            };
        }
        const problemIndex = assignment.assignmentUsers[userIndex].assigmentUserProblemStatus.findIndex((problem: IProblemStatus) => problem.problemId === problemId);
        if (problemIndex === -1) {
            return {
                ok: false,
                message: "Problem not found"
            };
        }
        assignment.assignmentUsers[userIndex].assigmentUserProblemStatus[problemIndex].problemScore > marks ? null : assignment.assignmentUsers[userIndex].assignmentUserCurrentMarks += marks;
        await assignment.save();
        return {
            ok: true,
            message: "Marks updated successfully"
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message
        };
    }
};