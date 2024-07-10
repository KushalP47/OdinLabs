import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import getTestCases from '../functions/judge/getTestCases';
import getTokens from '../functions/judge/getTokens';
import { SubmissionResponse, testcaseVerdict } from '../models/submissions.model';
import { Submission } from '../models/submissions.model';
class JudgeController {

    async submit(req: Request, res: Response) {
        try {

            const { sourceCode, languageId, problemId } = req.body;
            // const userId = req.body.user.rollNumber;
            console.log(sourceCode, languageId, problemId);

            const testcases = await getTestCases(problemId);

            const submissionJson = testcases.map((testCase) => ({
                "language_id": languageId,
                "source_code": sourceCode,
                "stdin": testCase.input,
                "expected_output": testCase.expectedOutput
            }));

            const submissionString = JSON.stringify(
                {
                    "submissions": submissionJson
                }
            );

            console.log(submissionString);;

            const tokens = await getTokens(submissionString) as Array<string>

            console.log("Tokens: ", tokens);

            const tokenUrl = `${process.env.VITE_RAPIDAPI_URL}/batch?tokens=${tokens.join(',')}&base64_encoded=true`;

            console.log("before det")

            console.log("TokenUrl: " + tokenUrl)
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": process.env.VITE_RAPIDAPI_HOST || "",
                    "X-RapidAPI-Key": process.env.VITE_RAPIDAPI_KEY || "",
                },
            };

            const response = await fetch(tokenUrl, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const resp = await response.json() as SubmissionResponse;

                // Transforming the response
                const transformedSubmissions: testcaseVerdict[] = resp.submissions.map(submission => ({
                    time: submission.time,
                    memory: submission.memory,
                    status: submission.status.description
                }));

                res.json(
                    new ApiResponse(
                        200,
                        transformedSubmissions
                    )
                );
            }
        } catch (Error) {
            res.send(Error);
        }
    }

    async getSubmissions(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const submissions = await Submission.find({ userId: user.rollNumber });
            res.json(
                new ApiResponse(
                    200,
                    submissions
                )
            );
        } catch (Error) {
            res.send(Error);
        }
    }
}

export const judgeController = new JudgeController();