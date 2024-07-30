import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { Problem, IProblem, IProblemFunctionResponse } from '../models/problem.model';
import { Editorial, IEditorial, IEditorialFunctionResponse } from '../models/editorial.model';
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
            problemCppTemplate,
            problemJavaTemplate,
            problemPythonTemplate,
            problemEditorial,
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
            problemCppTemplate,
            problemJavaTemplate,
            problemPythonTemplate,
        });

        const editorial: IEditorial = new Editorial({
            editorialId: problemId,
            editorialContent: problemEditorial,
        });

        try {
            const savedProblem = await problem.save();
            const savedEditorial = await editorial.save();
            const response = {
                ok: true,
                message: "Problem created successfully",
                data: {
                    savedProblem: savedProblem,
                    savedEditorial: savedEditorial,
                }
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

    async changeProblemStatus(req: Request, res: Response) {
        const problemId = req.params.problemId;
        const problemIsHidden = req.params.problemIsHidden;
        if (problemIsHidden !== "true" && problemIsHidden !== "false") {
            return res.status(200).json(new ApiError(400, "Invalid value for problemIsHidden"));
        }
        let newVal;
        if (problemIsHidden === "true") {
            newVal = true;
        } else {
            newVal = false;
        }
        try {
            const problem: IProblem | null = await Problem
                .findOneAndUpdate({ problemId }, { problemIsHidden: newVal }, { new: true });
            if (!problem) {
                return res.status(200).json(new ApiError(404, "Problem not found"));
            }
            const response: IProblemFunctionResponse = {
                ok: true,
                message: "Problem status updated successfully",
                problem: problem,
            };
            return res.status(200).json(new ApiResponse(200, response, "Problem status updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    }

    async changeProblemEditorialStatus(req: Request, res: Response) {
        const problemId = req.params.problemId;
        const problemEditorialIsHidden = req.params.problemEditorialIsHidden;
        if (problemEditorialIsHidden !== "true" && problemEditorialIsHidden !== "false") {
            return res.status(200).json(new ApiError(400, "Invalid value for problemEditorialIsHidden"));
        }
        let newVal;
        if (problemEditorialIsHidden === "true") {
            newVal = true;
        } else {
            newVal = false;
        }
        try {
            const problem: IProblem | null = await Problem
                .findOneAndUpdate({ problemId }, { problemEditorialIsHidden: newVal }, { new: true });
            const editorial: IEditorial | null = await Editorial.findOneAndUpdate({ editorialId: problemId }, { editorialIsHidden: newVal }, { new: true });
            if (!problem) {
                return res.status(200).json(new ApiError(404, "Problem not found"));
            }
            const response = {
                ok: true,
                message: "Problem editorial status updated successfully",
                data: {
                    problem: problem,
                    editorial: editorial,
                }
            };
            return res.status(200).json(new ApiResponse(200, response, "Problem editorial status updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    }

    async getEditorialById(req: Request, res: Response) {
        const editorialId = req.params.editorialId;
        try {
            const editorial: IEditorial | null = await Editorial
                .findOne({ editorialId });
            if (!editorial) {
                return res.status(200).json(new ApiError(404, "Editorial not found"));
            }
            if (editorial.editorialIsHidden) {
                return res.status(200).json(new ApiError(404, "Editorial is hidden"));
            }
            const response: IEditorialFunctionResponse = {
                ok: true,
                message: "Editorial fetched successfully",
                editorial: editorial,
            };
            return res.status(200).json(new ApiResponse(200, response, "Editorial fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error.message));
        }
    }
}

export const problemController = new ProblemController();