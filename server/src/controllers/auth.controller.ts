import { Request, Response } from 'express';
import { IUserFunctionResponse } from '../models/user.model';
import { userExists, createUser, userFromEmail, updateUserPassword } from '../functions/auth';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';


class AuthController {

    async register(req: Request, res: Response) {
        const { userEmail, userPassword, userName, userRollNumber, userSection, userTeamName } = req.body;

        console.log(req.body)
        // create a new user
        const data = await createUser(userEmail, userPassword, userName, userRollNumber, userSection, userTeamName);

        if (!data.ok) {
            return res

                .status(200)
                .json(new ApiError(400, data.message));

        }

        // generate access tokens
        const accessToken = data.user?.generateAccessToken();
        if (!accessToken) {
            return res
                .status(200)
                .json(new ApiError(401, "Error creating access token"));
        }

        data.user?.save({ validateBeforeSave: false });
        return res
            .status(201)
            .cookie("accessToken", accessToken, {
                maxAge: 18000000, //5 hours
            }
            )
            .json(
                new ApiResponse(
                    201,
                    {
                        user: data.user?.toJSON(),
                    },
                    "User created successfully!!"
                )
            ).send();
    }

    async login(req: Request, res: Response) {
        const { userEmail, userPassword } = req.body;
        console.log("api post request received")
        // check if user exixts
        const data: IUserFunctionResponse = await userExists(userEmail, userPassword);
        if (!data.ok) {
            return res
                .status(401)
                .json(new ApiError(401, data.message));
        }
        const accessToken = data.user?.generateAccessToken();
        if (!accessToken) {
            return res
                .status(200)
                .json(new ApiError(401, "Error creating access token"));
        }

        return res
            .cookie("accessToken", accessToken, {
                maxAge: 18000000, //5 hours
            }
            )
            .json(
                new ApiResponse(
                    200,
                    {
                        user: data.user?.toJSON(),
                    },
                    "User logged in successfully!!"
                )
            );
    }

    async forgotPassword(req: Request, res: Response) {
        const { userEmail, userSecret, newPassword } = req.body;

        const userData: IUserFunctionResponse = await userFromEmail(userEmail);

        if (!userData.ok || !userData.user) {
            return res.status(200).json(new ApiError(404, "User not found"));
        }

        if (userData.user.userSecret !== userSecret) {
            return res.status(200).json(new ApiError(403, "Invalid secret"));
        }

        const result = await updateUserPassword(userData.user._id, newPassword);

        if (!result.ok) {
            return res.status(200).json(new ApiError(500, "Failed to update password"));
        }

        return res.json(
            new ApiResponse(
                200,
                {},
                "Your password has been updated successfully!"
            )
        );
    }

    async logout(req: Request, res: Response) {
        // Your logout logic here
        // remove access tokens
        return res
            .status(200)
            .clearCookie("accessToken")
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User logged out successfully!!"
                )
            );
    }
}

export const authController = new AuthController();