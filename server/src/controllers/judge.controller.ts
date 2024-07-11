import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import getTestCases from '../functions/judge/getTestCases';
import getTokens from '../functions/judge/getTokens';
import { Submission, SubmissionResponse, testcaseVerdict } from '../models/submissions.model';
import { generateRandomLargeInteger } from '../utils/randomGenerator';
class JudgeController {

    // send the source code, language id and problem id to the judge0 api
    // get the tokens and send it to client
    async submit(req: Request, res: Response) {
        try {

            const { sourceCode, languageId, problemId } = req.body;
            const userId = req.body.user.rollNumber;
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

            res.json(
                new ApiResponse(
                    200,
                    tokens
                )
            );
        } catch (Error) {
            res.send(Error);
        }
    }

    // get the verdict of the submission
    // and store the submission in the database
    async storeSubmission(req: Request, res: Response) {
        const { testcasesVerdict } = req.body;
        const { user } = req.body;
        const userId = user.rollNumber;
        let cnt = 0;
        testcasesVerdict.forEach((verdict: testcaseVerdict) => {
            if (verdict.status === "Accepted") {
                cnt++;
            }
        });
        console.log(testcasesVerdict);
        const newSubmission = new Submission({
            submissionId: generateRandomLargeInteger(),
            sourceCode: req.body.sourceCode,
            languageId: req.body.languageId,
            problemId: req.body.problemId,
            status: `${cnt}/${testcasesVerdict.length}`,
            userId: userId,
            testcasesVerdict: req.body.testcasesVerdict
        });
        newSubmission.save();
        res.json(
            new ApiResponse(
                200,
                newSubmission
            )
        );
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