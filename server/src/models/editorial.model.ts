import { Document, Model, Schema, model } from 'mongoose';

export interface IEditorial extends Document {
    editorialId: number;
    editorialIsHidden: boolean;
    editorialContent: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEditorialFunctionResponse {
    ok: boolean;
    message: string;
    editorial?: IEditorial;
    editorials?: IEditorial[];
}

const editorialSchema = new Schema({
    editorialId: {
        type: Number,
        required: true,
        unique: true
    },
    editorialIsHidden: {
        type: Boolean,
        default: true
    },
    editorialContent: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Editorial: Model<IEditorial> = model<IEditorial>('Editorial', editorialSchema);