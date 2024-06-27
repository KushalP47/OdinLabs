import { asyncHandler } from "../utils/AsyncHandler"
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User, JwtPayload } from "../models/user.model";
import { Request, Response, NextFunction } from "express"

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // if user doesn't have access tokens then send error
        if (!accessToken) {
            throw new ApiError(401, "User not authenticated!!");
        }

        // verify the user by comparing the access tokens
        const secret = process.env.ACCESS_TOKEN_SECRET || "";
        const decoded = jwt.verify(accessToken, secret) as JwtPayload;

        // adding the user object in the request object
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            throw new ApiError(401, "User not authenticated!!");
        }

        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }

});