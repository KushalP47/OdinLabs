import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { Problem, IProblem, IProblemFunctionResponse } from '../models/problem.model';

class ProblemController {
    async createProblem(req: Request, res: Response) {
        const {
            problemId,
            problemTitle,
            problemDescription,
            problemTags,
            problemDifficulty,
            problemInputFormat,
            problemOutputFormat,
            problemSampleInput,
            problemSampleOutput,
            problemNote,
            problemConstraints,
            problemTestcases,
            problemSolution,
            problemIsHidden,
        } = req.body;

        const problem: IProblem = new Problem({
            problemId,
            problemTitle,
            problemDescription,
            problemTags,
            problemDifficulty,
            problemInputFormat,
            problemOutputFormat,
            problemSampleInput,
            problemSampleOutput,
            problemNote,
            problemConstraints,
            problemTestcases,
            problemSolution,
            problemIsHidden,
        });

        try {
            const savedProblem = await problem.save();
            const response: IProblemFunctionResponse = {
                ok: true,
                message: "Problem created successfully",
                problem: savedProblem,
            };
            return res.status(201).json(new ApiResponse(201, response, "Problem created successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    };

    async updateProblem(req: Request, res: Response) {
    };

    async deleteProblem(req: Request, res: Response) {
    };

    async getAllProblems(req: Request, res: Response) {
        try {
            console.log("Fetching problems")
            let problems = await Problem.find();
            if (req.body.user.userIsAdmin === false) {
                problems = problems.filter(problem => !problem.problemIsHidden);

            }
            const response: IProblemFunctionResponse = {
                ok: true,
                message: "Problems fetched successfully",
                problems: problems,
            };
            return res.status(200).json(new ApiResponse(200, response, "Problems fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    };

    async getProblemsByIds(req: Request, res: Response) {
        const problemIds: number[] = req.body.problemIds;
        try {
            const problems: IProblem[] = await Problem
                .find({ problemId: { $in: problemIds } });
            const response: IProblemFunctionResponse = {
                ok: true,
                message: "Problems fetched successfully",
                problems: problems,
            };
            return res.status(200).json(new ApiResponse(200, response, "Problems fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    }

    async getProblemById(req: Request, res: Response) {
        const problemId = req.params.problemId;
        try {
            const problem: IProblem | null = await Problem
                .findOne({ problemId });
            if (!problem) {
                return res.status(404).json(new ApiError(404, "Problem not found"));
            }
            const response: IProblemFunctionResponse = {
                ok: true,
                message: "Problem fetched successfully",
                problem: problem,
            };
            return res.status(200).json(new ApiResponse(200, response, "Problem fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    };

}

export const problemController = new ProblemController();