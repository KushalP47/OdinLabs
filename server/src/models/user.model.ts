import { Document, Model, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    rollNumber: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    encryptPassword: (password: string) => string;
    validPassword: (password: string) => boolean;
    generateAccessToken: () => string;
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
    firstName: {
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
    return jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        email: this.email,
        rollNumber: this.rollNumber,
    },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
};


export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);