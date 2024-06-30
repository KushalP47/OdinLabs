export interface Offer {
    offerId: string;
    studentId: string;
    offer: RTCSessionDescriptionInit;
    timestamp: Date;
    answer?: RTCSessionDescriptionInit;
}