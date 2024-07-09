import { asyncHandler } from "../utils/AsyncHandler"
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User, JwtPayload } from "../models/user.model";
import { Request, Response, NextFunction } from "express"

export const verifyIsAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // if user doesn't have access tokens then send error
        if (!accessToken) {
            // throw new ApiError(401, "User not authenticated!!");
            return res
                .status(401)
                .json(new ApiError(401, "Request doesn't have token!!"));
        }

        // verify the user by comparing the access tokens
        const secret = process.env.ACCESS_TOKEN_SECRET || "";
        const decoded = jwt.verify(accessToken, secret) as JwtPayload;

        // adding the user object in the request object
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            // throw new ApiError(401, "User not authenticated!!");
            return res
                .status(401)
                .json(new ApiError(401, "User is not registered!!"));
        }

        if (!user.isAdmin) {
            return res
                .status(401)
                .json(new ApiError(401, "User is not an admin!!"));
        }

        // req.user = user;
        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }

});
