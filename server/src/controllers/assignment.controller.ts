import { ApiError } from "../utils/ApiError";
import { Assignment } from "../models/assignment.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from 'express';
import { getUserFromSection } from "../functions/user/getUserFromSection";
import { updateAssignmentDeadlines } from "../functions/assignment/updateAssignmentDeadline";
import { IUserFunctionResponse } from "../models/user.model";
class AssignmentController {
    async createAssignment(req: Request, res: Response) {
        const {
            assignmentId,
            assignmentName,
            assignmentDescription,
            assignmentProblems,
            assignmentStartTime,
            assignmentEndTime,
            assignmentSection,
        } = req.body;

        const usersInfo: IUserFunctionResponse = await getUserFromSection(assignmentSection);
        if (!usersInfo.ok) {
            return res.status(200).json(new ApiError(400, usersInfo.message));
        }
        if (!usersInfo.usersInfo) {
            return res.status(200).json(new ApiError(400, "No users found in the given section"));
        }
        const assignmentUsers = usersInfo.usersInfo.map((user) => {
            return {
                assignmentUserRollNumber: user.userRollNumber,
                assignmentUserCurrentMarks: 0,
                assigmentUserProblemStatus: assignmentProblems.map((problemId: number) => {
                    return {
                        problemId,
                        problemScore: 0,
                    };
                }),
                assignmentUserTeamName: user.userTeamName,
            };
        });

        const assignment = new Assignment({
            assignmentId,
            assignmentName,
            assignmentDescription,
            assignmentProblems,
            assignmentStartTime,
            assignmentEndTime,
            assignmentSection,
            assignmentUsers,
        });

        try {
            const savedAssignment = await assignment.save();
            const response = {
                ok: true,
                message: "Assignment created successfully",
                assignment: savedAssignment,
            };
            return res.status(201).json(new ApiResponse(201, response, "Assignment created successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    };

    async getAssignment(req: Request, res: Response) {
        const { assignmentId } = req.params;
        try {
            const intAssignmentId = parseInt(assignmentId, 10);
            const assignment = await Assignment.findOne({ assignmentId: intAssignmentId });
            if (!assignment) {
                return res.status(401).json(new ApiError(404, "Assignment not found"));
            }
            const response = {
                ok: true,
                message: "Assignment fetched successfully",
                assignment,
            };
            return res.status(200).json(new ApiResponse(200, response, "Assignment fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async getAllAssignments(req: Request, res: Response) {
        try {
            const assignments: typeof Assignment[] = await Assignment.find();
            const response = {
                ok: true,
                message: "Assignments fetched successfully",
                assignments,
            };
            return res.status(200).json(new ApiResponse(200, response, "Assignments fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async updateAssignmentDeadline(req: Request, res: Response) {
        const { assignmentId } = req.params;
        const { assignmentStartTime, assignmentEndTime } = req.body;

        try {
            const intAssignmentId = parseInt(assignmentId, 10);
            const response = await updateAssignmentDeadlines(intAssignmentId, assignmentStartTime, assignmentEndTime);
            if (!response.ok) {
                return res.status(400).json(new ApiError(400, response.message));
            }
            return res.status(200).json(new ApiResponse(200, response, "Assignment deadlines updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async updateAssignment(req: Request, res: Response) {
        const { assignmentId } = req.params;
        const {
            assignmentName,
            assignmentDescription,
            assignmentProblems,
            assignmentStartTime,
            assignmentEndTime,
            assignmentSection,
        } = req.body;

        try {
            const intAssignmentId = parseInt(assignmentId, 10);
            const assignment = await Assignment.findOne({ assignmentId: intAssignmentId });
            if (!assignment) {
                return res.status(402).json(new ApiError(404, "Assignment not found"));
            }
            assignment.assignmentName = assignmentName;
            assignment.assignmentDescription = assignmentDescription;
            assignment.assignmentProblems = assignmentProblems;
            assignment.assignmentStartTime = assignmentStartTime;
            assignment.assignmentEndTime = assignmentEndTime;
            assignment.assignmentSection = assignmentSection;

            const savedAssignment = await assignment.save();
            const response = {
                ok: true,
                message: "Assignment updated successfully",
                assignment: savedAssignment,
            };
            return res.status(200).json(new ApiResponse(200, response, "Assignment updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async deleteAssignment(req: Request, res: Response) {
    };

    async getAssignmentDeadline(req: Request, res: Response) {
        const assignmentId = req.params.assignmentId;
        try {
            const intAssignmentId = Number(assignmentId);
            const assignment = await Assignment.findOne({ assignmentId: intAssignmentId });
            if (!assignment) {
                return res.status(404).json(new ApiError(404, "Assignment not found"));
            }
            const response = {
                ok: true,
                message: "Assignment deadline fetched successfully",
                assignmentStartTime: assignment.assignmentStartTime,
                assignmentEndTime: assignment.assignmentEndTime,
            };
            return res.status(200).json(new ApiResponse(200, response, "Assignment deadline fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));

        }
    }
};

export const assignmentController = new AssignmentController();