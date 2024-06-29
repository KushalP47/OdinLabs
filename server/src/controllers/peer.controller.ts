import { Request, Response } from 'express';
import { Offer } from '../models/offer.model';
import { ApiResponse } from '../utils/ApiResponse';
export class PeerController {

    async storeOffer(req: Request, res: Response) {
        const { offerId, studentId, offer } = req.body;
        const newOffer = new Offer({
            offerId,
            studentId,
            offer,
            timestamp: new Date(),
        });
        await newOffer.save();
        res
            .status(201)
            .json(new ApiResponse(201, {}, 'Offer stored successfully'));
    }

    async getAnswer(req: Request, res: Response) {
        const { offerId } = req.body;
        const offer = await Offer.findOne({ offerId });
        if (offer && offer.answer) {
            res.status(201)
                .json(new ApiResponse(201, { answer: offer.answer }, 'Answer found successfully'));
        } else {
            res.status(205)
                .json(new ApiResponse(201, { answer: {} }, 'Answer Not Found'));
        }
    }

    async getOffers(req: Request, res: Response) {
        const offers = await Offer.find();
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        offers,
                    },
                    "Offers fetched successfully!!"
                )
            );
    }

    async storeAnswer(req: Request, res: Response) {
        const { offerId, answer } = req.body;
        await Offer.updateOne({ offerId }, { answer });
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {
                        answer: answer,
                    },
                    "Answer stored successfully!!"
                )
            );
    }
}

export const peerController = new PeerController();