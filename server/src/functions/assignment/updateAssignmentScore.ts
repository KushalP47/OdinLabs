import { Assignment, IAssignmentFunctionResponse, IAssignmentUser, IProblemStatus } from "../../models/assignment.model";

export const updateAssignmentScore = async (assignmentId: number, userRollNumber: string, problemId: number, marks: number): Promise<IAssignmentFunctionResponse> => {
    try {
        console.log(assignmentId, userRollNumber, problemId, marks);
        const assignment = await Assignment.findOne({
            assignmentId
        });
        console.log(assignment);
        if (!assignment) {
            return {
                ok: false,
                message: "Assignment not found"
            };
        }
        const userIndex = assignment.assignmentUsers.findIndex((user: IAssignmentUser) => user.assignmentUserRollNumber === userRollNumber);
        console.log(userIndex);
        if (userIndex === -1) {
            return {
                ok: false,
                message: "User not found"
            };
        }
        const problemIndex = assignment.assignmentUsers[userIndex].assigmentUserProblemStatus.findIndex((problem: IProblemStatus) => problem.problemId === problemId);
        console.log(problemIndex);
        if (problemIndex === -1) {
            return {
                ok: false,
                message: "Problem not found"
            };
        }
        console.log(assignment.assignmentUsers[userIndex].assigmentUserProblemStatus[problemIndex].problemScore, marks);
        console.log("Marks updated successfully");
        // assignment.assignmentUsers[userIndex].assigmentUserProblemStatus[problemIndex].problemScore < marks ? null : assignment.assignmentUsers[userIndex].assignmentUserCurrentMarks += marks;
        if (marks > assignment.assignmentUsers[userIndex].assigmentUserProblemStatus[problemIndex].problemScore) {
            assignment.assignmentUsers[userIndex].assigmentUserProblemStatus[problemIndex].problemScore = marks;
        }
        let newMarks = 0;
        assignment.assignmentUsers[userIndex].assigmentUserProblemStatus.forEach((problem: IProblemStatus) => {
            newMarks += problem.problemScore;
        });
        assignment.assignmentUsers[userIndex].assignmentUserCurrentMarks = newMarks;
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