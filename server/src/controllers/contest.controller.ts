import { ApiError } from "../utils/ApiError";
import { Contest } from "../models/contest.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from 'express';
import { getUserFromSection } from "../functions/user/getUserFromSection";
import { generateContestCustomCookie } from "../functions/contest/generateContestCustomCookie";
import { IUserFunctionResponse } from "../models/user.model";
class ContestController {

    // Admin Functions
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
            const usersInfo: IUserFunctionResponse = await getUserFromSection(contestSection);
            if (!usersInfo.ok) {
                return res.status(200).json(new ApiError(400, usersInfo.message));
            }
            if (!usersInfo.usersInfo) {
                return res.status(200).json(new ApiError(400, "No users found in the given section"));
            }
            const contestUsers = usersInfo.usersInfo.map((user) => {
                return {
                    contestUserRollNumber: user.userRollNumber,
                    contestUserCurrentMarks: 0,
                    contestUserName: user.userName,
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

    async updateContest(req: Request, res: Response) {
        const { contestId } = req.params;
        const {
            contestName,
            contestDescription,
            contestProblems,
            contestStartTime,
            contestEndTime,
            contestSection,
        } = req.body;

        try {
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(404, "Contest not found"));
            }

            contest.contestName = contestName;
            contest.contestDescription = contestDescription;
            contest.contestProblems = contestProblems;
            contest.contestStartTime = contestStartTime;
            contest.contestEndTime = contestEndTime;
            contest.contestSection = contestSection;
            contest.contestUsers = contest.contestUsers;
            const savedContest = await contest.save();
            const response = {
                ok: true,
                message: "Contest updated successfully",
                contest: savedContest,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async deleteContest(req: Request, res: Response) {
    }

    async getContest(req: Request, res: Response) {
        const { contestId } = req.params;
        try {
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
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


    async getAllContests(req: Request, res: Response) {
        try {
            const contests = await Contest.find();
            const response = {
                ok: true,
                message: "Contests fetched successfully",
                contests,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contests fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async signInContest(req: Request, res: Response) {
        try {
            const { contestId } = req.params;
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(404).json(new ApiError(404, "Contest not found"));
            }
            const user = req.body.user;
            const contestUser = contest.contestUsers.find((contestUser) => contestUser.contestUserRollNumber === user.userRollNumber);
            if (!contestUser) {
                return res.status(200).json(new ApiError(200, "User not found in contest"));
            }
            if (contestUser.contestCustomCookie !== "") {
                return res.status(200).json(new ApiError(200, "User already signed in"));
            }
            contestUser.contestCustomCookie = await generateContestCustomCookie(contest.contestId.toString(), user);
            await contest.save();
            const response = {
                ok: true,
                message: "User signed in successfully",
                contestId: contest.contestId,
            };
            return res
                .status(200)
                .cookie("customContestCookie", contestUser.contestCustomCookie)
                .json(new ApiResponse(200, response, "User signed in successfully"));

        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async updateContestDeadline(req: Request, res: Response) {
    }

    async clearUserContestCustomCookie(req: Request, res: Response) {
        try {
            const { contestId, userRollNumber } = req.body;
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(200, "Contest not found"));
            }
            // console.log(contest);
            let contestUser;
            for (let i = 0; i < contest.contestUsers.length; i++) {
                console.log(contest.contestUsers[i].contestUserRollNumber, userRollNumber);
                if (contest.contestUsers[i].contestUserRollNumber === userRollNumber) {
                    contestUser = contest.contestUsers[i];
                    break;
                }
            }
            if (!contestUser) {
                return res.status(200).json(new ApiError(200, "User not found in contest"));
            }
            contestUser.contestCustomCookie = "";
            await contest.save();
            const response = {
                ok: true,
                message: "User signed out successfully",
            };
            return res
                .status(200)
                .clearCookie("customContestCookie")
                .json(new ApiResponse(200, response, "User signed out successfully"));

        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));

        }
    }

    async getContestDeadline(req: Request, res: Response) {
        const { contestId } = req.params;
        try {
            const intContestId = Number(contestId);
            const contest = await Contest
                .findOne({ contestId: intContestId })
                .select("contestStartTime contestEndTime");
            if (!contest) {
                return res.status(404).json(new ApiError(404, "Contest not found"));
            }
            const response = {
                ok: true,
                message: "Contest deadline fetched successfully",
                contestStartTime: contest.contestStartTime,
                contestEndTime: contest.contestEndTime,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest deadline fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

};

export const contestController = new ContestController();