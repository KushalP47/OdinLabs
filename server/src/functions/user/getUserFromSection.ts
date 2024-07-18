import { User } from '../../models/user.model';

export interface UserInfo {
    name: string;
    rollNumber: string;
    section: string;
    email: string;
    teamName?: string;
}
export const getUserFromSection = async (section: string): Promise<UserInfo[]> => {
    const users = await User.find({ section });
    const usersInfo: Array<UserInfo> = [];
    users.forEach((user) => {
        const userInfo: UserInfo = {
            name: user.userName,
            rollNumber: user.userRollNumber,
            section: user.userSection,
            email: user.userEmail,
            teamName: user.userTeamName?.toString(),
        };
        usersInfo.push(userInfo);
    });
    return usersInfo;
}