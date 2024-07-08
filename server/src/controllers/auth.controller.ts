import { Request, Response } from 'express';
import { IUserFunctionResponse } from '../models/user.model';
import { userExists, createUser } from '../functions/auth';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';


class AuthController {

    async register(req: Request, res: Response) {
        const { email, password, name, rollNumber } = req.body;

        // create a new user
        const data = await createUser(email, password, name, rollNumber);

        if (!data.ok) {
            throw new ApiError(400, data.message);
        }

        // generate access tokens
        const accessToken = data.user?.generateAccessToken();
        if (!accessToken) {
            return res
                .status(401)
                .json(new ApiError(401, "Error creating access token"));
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        data.user?.save({ validateBeforeSave: false });
        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    201,
                    {
                        user: data.user?.toJSON(),
                        accessToken: accessToken,
                    },
                    "User created successfully!!"
                )
            ).send();
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log("api post request received")
        // check if user exixts
        const data: IUserFunctionResponse = await userExists(email, password);
        if (!data.ok) {
            return res
                .status(401)
                .json(new ApiError(401, data.message));
        }
        const accessToken = data.user?.generateAccessToken();
        if (!accessToken) {
            return res
                .status(401)
                .json(new ApiError(401, "Error creating access token"));
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: data.user?.toJSON(),
                        accessToken: accessToken,
                    },
                    "User logged in successfully!!"
                )
            ).send();
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
            )
    }
}

export const authController = new AuthController();