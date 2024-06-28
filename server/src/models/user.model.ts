import { Document, Model, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    rollNumber: string;
    isAdmin: boolean;
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
}

export interface IUserFunctionResponse {
    ok: boolean;
    message: string;
    user?: IUser;
}

interface IUserModel extends Model<IUser> { }

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

userSchema.pre<IUser>('save', function (next) {
    if (this.isModified('password')) {
        this.password = this.encryptPassword(this.password);
    }
    next();
});

userSchema.methods.encryptPassword = function (password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const jwtSecret = process.env.ACCESS_TOKEN || "";
    const payload: JwtPayload = {
        _id: this._id,
        name: this.name,
        email: this.email,
        rollNumber: this.rollNumber,
    };
    const res = jwt.sign(payload, jwtSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return res;
};


export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);