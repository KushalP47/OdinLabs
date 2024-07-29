import { User, IUserFunctionResponse, UserInfo } from '../../models/user.model';


export const getUserFromSection = async (section: string): Promise<IUserFunctionResponse> => {
    try {
        const users = await User.find({ userSection: section });
        if (!users) {
            return {
                ok: false,
                message: "No users found in the given section"
            };
        }
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
        return {
            ok: true,
            message: "Users fetched successfully",
            usersInfo: usersInfo,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        };
    }

}