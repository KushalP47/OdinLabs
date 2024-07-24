import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const generateContestCustomCookie = async (contestId: string, user: any) => {
    const jwtContestSecret = process.env.JWT_CONTEST_SECRET || "";
    const payload: JwtPayload = {
        contestId,
        userRollNumber: user.rollNumber,
        userName: user.name,
        userEmail: user.email,
    };
    const res = jwt.sign(payload, jwtContestSecret, { expiresIn: process.env.JWT_CONTEST_EXPIRY });
    return res;
}