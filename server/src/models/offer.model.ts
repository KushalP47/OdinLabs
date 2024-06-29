import { Document, Model, Schema, model } from 'mongoose';

export type RTCSdpType = 'offer' | 'pranswer' | 'answer' | 'rollback';
interface RTCSessionDescriptionInit {
    type?: RTCSdpType;
    sdp?: string;
}

export interface IOffer extends Document {
    offerId: string;
    studentId: string;
    offer: RTCSessionDescriptionInit;
    timestamp: Date;
    answer?: RTCSessionDescriptionInit;
    createdAt: Date;
    updatedAt: Date;
}

interface IOfferModel extends Model<IOffer> { }

const offerSchema = new Schema({
    offerId: {
        type: String,
        required: true,
        unique: true,
    },
    studentId: {
        type: String,
        required: true,
    },
    offer: {
        type: Object,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    answer: {
        type: Object,
    },
}, { timestamps: true });

export const Offer: IOfferModel = model<IOffer, IOfferModel>('Offer', offerSchema);
