import { User } from '../../models/user.model';

export interface UserInfo {
    userName: string;
    userRollNumber: string;
    userSection: string;
    userEmail: string;
    userTeamName: string;
}
export const getUserFromSection = async (section: string): Promise<UserInfo[]> => {
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