import { Document, Model, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    userEmail: string;
    userPassword: string;
    userName: string;
    userRollNumber: string;
    userSection: string;
    userIsAdmin: boolean;
    userTeamName?: string;
    createdAt: Date;
    updatedAt: Date;
    encryptPassword: (password: string) => string;
    validPassword: (password: string) => boolean;
    generateAccessToken: () => string;
}

export interface JwtPayload {
    _id: string;
    name: string;
    email: string;
    rollNumber: string;
    isAdmin: boolean;
}

export interface IUserFunctionResponse {
    ok: boolean;
    message: string;
    user?: IUser;
}

interface IUserModel extends Model<IUser> { }

const userSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userRollNumber: {
        type: String,
        required: true
    },
    userSection: {
        type: String,
        required: true
    },
    userTeamName: {
        type: String,
        default: ""
    },
    userIsAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

userSchema.pre<IUser>('save', function (next) {
    if (this.isModified('password')) {
        this.userPassword = this.encryptPassword(this.userPassword);
    }
    next();
});

userSchema.methods.encryptPassword = function (password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function (password: string) {
    return bcrypt.compareSync(password, this.userPassword);
};

userSchema.methods.generateAccessToken = function () {
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "";
    const payload: JwtPayload = {
        _id: this._id,
        name: this.userName,
        email: this.userEmail,
        isAdmin: this.userIsAdmin,
        rollNumber: this.userRollNumber,
    };
    const res = jwt.sign(payload, jwtSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return res;
};


export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);