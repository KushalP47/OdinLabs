import { User, IUserFunctionResponse } from '../../models/user.model';

export const createUser = async (email: string, password: string, name: string, rollNumber: string): Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    if (!email || !password || !name || !rollNumber) {
        data.message = 'All fields are required';
        return data;
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        data.message = 'Email already exists';
        return data;
    }

    const rollNumberExists = await User.findOne({ rollNumber });
    if (rollNumberExists) {
        data.message = 'Roll number already exists';
        return data;
    }

    const isAdmin = email === 'kushal.p@ahduni.edu.in' ? true : false;
    const newUser = new User({
        email,
        password,
        name,
        rollNumber,
        isAdmin
    });

    const user = await newUser.save();
    data.ok = true;
    data.message = 'User created successfully';
    data.user = user;

    return data;
}