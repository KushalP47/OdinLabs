import { User, IUser, IUserFunctionResponse } from '../../models/user.model';

export const userFromEmail = async (userEmail: string) : Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    if(!userEmail) {
        data.message = 'Email is required';
        return data;
    }
    
    const emailExists = await User.findOne({ userEmail });
    if (!emailExists) {
        data.message = 'Email does not exist';
        return data;
    }
    
    const user: IUser = emailExists;
    data.ok = true;
    data.message = 'User exists';
    data.user = user;

    return data;
}

export const userExists = async (userEmail: string, userPassword: string): Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    if (!userEmail || !userPassword) {
        data.message = 'Email and password are required';
        return data;
    }

    const emailExists = await User.findOne({ userEmail });
    if (!emailExists) {
        data.message = 'Email does not exist';
        return data;
    }

    const user: IUser = emailExists;
    const passwordMatch = user.validPassword(userPassword);
    if (!passwordMatch) {
        data.message = 'Password is incorrect';
        return data;
    }

    data.ok = true;
    data.message = 'User exists';
    data.user = user;

    return data;
}