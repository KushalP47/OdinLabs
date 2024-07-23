import { User, IUserFunctionResponse } from '../../models/user.model';

export const updateUserPassword = async (userId: any, newPassword: string): Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    try {
        const user = await User.findById(userId);
        if (!user) {
            data.message = 'User not found';
            return data;
        }

        user.userPassword = newPassword;
        await user.save();

        data.ok = true;
        data.message = 'Password updated successfully';
        return data;
    } catch (error) {
        console.error('Failed to update password:', error);
        data.message = 'Failed to update password';
        return data;
    }
};