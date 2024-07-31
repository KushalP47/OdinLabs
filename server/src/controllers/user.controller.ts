import { Request, Response } from 'express';
import { IUserFunctionResponse, } from '../models/user.model';
import { userExists, createUser, userFromEmail, updateUserPassword } from '../functions/auth';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { User, UserInfo } from '../models/user.model';
import { getUserFromSection } from '../functions/user/getUserFromSection';
import { generateRandomString } from '../utils/randomGenerator';

export class UserController {
    async getUsersFromSection(req: Request, res: Response) {
        const { section } = req.body;
        const users: IUserFunctionResponse = await getUserFromSection(section);
        if (!users.ok) {
            return res.status(200).json(new ApiError(400, users.message));
        }
        const response = {
            ok: true,
            message: "Users fetched successfully",
            data: users.usersInfo,
        };
        return res.status(200).json(new ApiResponse(200, response, "Users fetched successfully"));
    }

    async editUser(req: Request, res: Response) {
        const { userEmail, userName, userRollNumber, userSection, userTeamName } = req.body;
        try {
            const user = await User.findOne({ userEmail });
            if (!user) {
                return res.status(200).json(new ApiError(400, "User not found"));
            }
            user.userName = userName;
            user.userRollNumber = userRollNumber;
            user.userSection = userSection;
            user.userTeamName = userTeamName;
            await user.save();
            const response = {
                ok: true,
                message: "User updated  successfully",
                data: user,
            };
            return res.status(200).json(new ApiResponse(200, response, "User updated successfully"));
        } catch (error: any) {
            return res.status(200).json(new ApiError(400, error.message));

        }
    }

    async deleteUser(req: Request, res: Response) {
        const { userEmail } = req.body;
        try {
            const user = await User.findOne({ userEmail });
            if (!user) {
                return res.status(200).json(new ApiError(400, "User not found"));
            }
            await user.deleteOne({ userEmail });
            const response = {
                ok: true,
                message: "User deleted successfully",
            };
            return res.status(200).json(new ApiResponse(200, response, "User deleted successfully"));
        } catch (error: any) {
            return res.status(200).json(new ApiError(400, error.message));
        }
    }

    async changeUserSecret(req: Request, res: Response) {
        console.log(req.body);
        const { userEmail } = req.body;
        console.log(req.body);
        try {
            const user = await User.findOne({ userEmail });
            if (!user) {
                return res.status(200).json(new ApiError(400, "User not found"));
            }
            user.userSecret = "";
            await user.save();
            const response = {
                ok: true,
                message: "User secret changed successfully",
                data: user,
            };
            return res.status(200).json(new ApiResponse(200, response, "User secret changed successfully"));
        } catch (error: any) {
            return res.status(200).json(new ApiError(400, error.message));
        }
    }

    async getUser(req: Request, res: Response) {
        const { userRollNumber } = req.params;
        const user = await User.findOne({ userRollNumber });
        if (!user) {
            return res.status(200).json(new ApiError(400, "User not found"));
        }
        const response = {
            ok: true,
            message: "User fetched successfully",
            data: user,
        };
        return res.status(200).json(new ApiResponse(200, response, "User fetched successfully"));
    }

}

export const userController = new UserController();