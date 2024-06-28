import { Request, Response } from 'express';
import { User, IUser, IUserFunctionResponse } from '../models/user.model';
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

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {
                        user: data.user?.toJSON()
                    },
                    "User created successfully!!"
                )
            );
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // check if user exixts
        const data: IUserFunctionResponse = await userExists(email, password);
        if (!data.ok) {
            throw new ApiError(400, data.message);
        }

        // generate access tokens
        const accessToken = data.user?.generateAccessToken();
        if (!accessToken) {
            throw new ApiError(400, "Error creating access token");
        }

        data.user?.save({ validateBeforeSave: false });
        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: data.user?.toJSON(),
                        accessToken,
                    },
                    "User logged in successfully!!"
                )
            );
    }

    async logout(req: Request, res: Response) {
        // Your logout logic here
        // check if user is logged in(by checking access tokens)
        const { email } = req.body;
        console.log(email);
        const emailExists = await User.findOne({ email });
        if (!emailExists) {
            throw new ApiError(400, "Email Not Found");
        }
        console.log(emailExists);
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