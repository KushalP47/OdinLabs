import { Request, Response } from 'express';
import { IUserFunctionResponse, } from '../models/user.model';
import { userExists, createUser, userFromEmail, updateUserPassword } from '../functions/auth';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';

interface UserInfo {
    userName: string;
    userRollNumber: string;
    userSection: string;
    userEmail: string;
    userTeamName: string;
}

export class UserController {
    async getUsersFromSection(req: Request, res: Response) {
        const { section } = req.body;
        const users = await User.find({ userSection: section });
        const usersInfo: Array<UserInfo> = [];
        users.forEach((user) => {
            if (!user.userIsAdmin) {
                const userInfo: UserInfo = {
                    userName: user.userName,
                    userRollNumber: user.userRollNumber,
                    userSection: user.userSection,
                    userEmail: user.userEmail,
                    userTeamName: user.userTeamName,
                };
                usersInfo.push(userInfo);
            }
        });
        return usersInfo;
    } 
}

export const userController = new UserController();