import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error: any) {
        // Standardizing the error message, to maintain the consistency throughout the codebase
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export { asyncHandler };