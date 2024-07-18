import {
	Assignment,
	IAssignmentFunctionResponse,
} from "../../models/assignment.model";

export const updateAssignmentDeadlines = async (
	assignmentId: number,
	assignmentStartTime: Date,
	assignmentEndTime: Date,
): Promise<IAssignmentFunctionResponse> => {
	try {
		const assignment = await Assignment.findOne({
			assignmentId,
		});
		if (!assignment) {
			return {
				ok: false,
				message: "Assignment not found",
			};
		}
		assignment.assignmentStartTime = assignmentStartTime;
		assignment.assignmentEndTime = assignmentEndTime;
		await assignment.save();
		return {
			ok: true,
			message: "Assignment deadlines updated successfully",
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message,
		};
	}
};
