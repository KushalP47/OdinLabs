import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

export const verifyCustomContestCookie = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customContestCookie = req.cookies?.customContestCookie;
        if (!customContestCookie) {
            return res
                .status(401)
                .json(new ApiError(401, "Request doesn't have custom contest cookie!!"));
        }
        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }
});

export const verifyNoCustomContestCookie = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customContestCookie = req.cookies?.customContestCookie;
        if (customContestCookie) {
            return res
                .status(401)
                .json(new ApiError(401, "Request already has custom contest cookie!!"));
        }
        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }
});