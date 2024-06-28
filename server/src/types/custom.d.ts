import { IUser } from '../models/user.model'; // Adjust the import path as necessary

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}