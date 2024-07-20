import { ApiError } from "../utils/ApiError";
import { Contest } from "../models/contest.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from 'express';
import { getUserFromSection } from "../functions/user/getUserFromSection";

class ContestController {
    
    async createContest(req: Request, res: Response) {
        const {
            contestId,
            contestName,
            contestDescription,
            contestProblems,
            contestStartTime,
            contestEndTime,
            contestSection,
        } = req.body;

        try {
            const usersInfo = await getUserFromSection(contestSection);
            const contestUsers = usersInfo.map((user) => {
                return {
                    contestUserRollNumber: user.rollNumber,
                    contestUserCurrentMarks: 0,
                    contestUserProblemStatus: contestProblems.map((problemId: number) => {
                        return {
                            problemId,
                            problemScore: 0,
                        };
                    }),
                    contestCustomCookie: "",
                };
            });
            const contest = new Contest({
                contestId,
                contestName,
                contestDescription,
                contestProblems,
                contestStartTime,
                contestEndTime,
                contestSection,
                contestUsers,
            });
            const savedContest = await contest.save();
            const response = {
                ok: true,
                message: "Contest created successfully",
                contest: savedContest,
            };
            return res.status(201).json(new ApiResponse(201, response, "Contest created successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async getContest(req: Request, res: Response) {
        const { contestId } = req.params;
        try {
            const contest = await Contest.findOne({ contestId });
            if (!contest) {
                return res.status(404).json(new ApiError(404, "Contest not found"));
            }
            const response = {
                ok: true,
                message: "Contest fetched successfully",
                contest,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async signInContest(req: Request, res: Response) {
    }

    async signOutContest(req: Request, res: Response) {
    }

    async logContestUserActivity(req: Request, res: Response) {
    }

    async updateContest(req: Request, res: Response) {

    }

    async deleteContest(req: Request, res: Response) {
    }

    async getAllContests(req: Request, res: Response) {
    }

    async updateContestDeadline(req: Request, res: Response) {
    }

};

export const contestController = new ContestController();