export interface User {
    userRollNumber: string;
    userSecret: string;
    userName: string;
    userEmail: string;
    userSection: string;
    userPassword: string;
    userIsAdmin: boolean;
    userTeamName: string;
}

export interface UserInfo {
    userName: string;
    userRollNumber: string;
    userSection: string;
    userEmail: string;
    userTeamName: string;
    userStatus?: string;
}