import { ApiError } from "../utils/ApiError";
import { Assignment } from "../models/assignment.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from 'express';
import { getUserFromSection } from "../functions/user/getUserFromSection";

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

        const usersInfo = await getUserFromSection(assignmentSection);
        const assignmentUsers = usersInfo.map((user) => {
            return {
                assignmentUserRollNumber: user.rollNumber,
                assignmentUserCurrentMarks: 0,
                assigmentUserProblemStatus: assignmentProblems.map((problemId: number) => {
                    return {
                        problemId,
                        problemScore: 0,
                    };
                }),
                assignmentUserTeamName: user.teamName,
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
            const assignment = await Assignment.findOne({ assignmentId });
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
            const assignment = await Assignment.findOne({ assignmentId });
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
};

export const assignmentController = new AssignmentController();