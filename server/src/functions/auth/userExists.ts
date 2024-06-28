import { User, IUser, IUserFunctionResponse } from '../../models/user.model';

export const userExists = async (email: string, password: string): Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    if (!email || !password) {
        data.message = 'Email and password are required';
        return data;
    }

    const emailExists = await User.findOne({ email });
    if (!emailExists) {
        data.message = 'Email does not exist';
        return data;
    }

    const user: IUser = emailExists;
    const passwordMatch = user.validPassword(password);
    if (!passwordMatch) {
        data.message = 'Password is incorrect';
        return data;
    }

    data.ok = true;
    data.message = 'User exists';
    data.user = user;

    return data;
}