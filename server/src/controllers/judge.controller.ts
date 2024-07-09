import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class JudgeController {
    
    async check(req: Request, res: Response) {
        const sourceCode = req.body;
        fetch('');
    }
}

export const judgeController = new JudgeController();