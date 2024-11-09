import { User, IUserFunctionResponse } from '../../models/user.model';

const admins: Array<string> = ['kushal.p@ahduni.edu.in', 'harsh.b2@ahduni.edu.in', 'jayendra.bhalodiya@ahduni.edu.in', 'mihir.k1@ahduni.edu.in', 'harsh.c2@ahduni.edu.in', 'jash.p@ahduni.edu.in', 'divyam.s@ahduni.edu.in']
export const createUser = async (userEmail: string, userPassword: string, userName: string, userRollNumber: string, userSection: string, userTeamName: string): Promise<IUserFunctionResponse> => {
    const data: IUserFunctionResponse = {
        ok: false,
        message: '',
    };

    if (!userEmail || !userPassword || !userName || !userRollNumber || !userSection) {
        data.message = 'All fields are required';
        return data;
    }

    const emailExists = await User.findOne({ userEmail }); // Corrected based on the user.model.ts structure
    if (emailExists) {
        data.message = 'Email already exists';
        return data;
    }

    const rollNumberExists = await User.findOne({ userRollNumber }); // Corrected based on the user.model.ts structure
    if (rollNumberExists) {
        data.message = 'Roll number already exists';
        return data;
    }

    const userIsAdmin = admins.includes(userEmail);
    const newUser = new User({
        userEmail, // Simplified based on the user.model.ts structure
        userPassword, // Simplified based on the user.model.ts structure
        userName, // Simplified based on the user.model.ts structure
        userRollNumber, // Simplified based on the user.model.ts structure
        userSection, // Simplified based on the user.model.ts structure
        userTeamName, // Assuming default value for optional field
        userIsAdmin // Simplified based on the user.model.ts structure
    });
    console.log("Saving New User");
    const user = await newUser.save();
    console.log("Saved New User");
    data.ok = true;
    data.message = 'User created successfully';
    data.user = user;

    return data;
}