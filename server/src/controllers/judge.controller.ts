import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { updateAssignmentScore } from '../functions/assignment/updateAssignmentScore';
import getTestCases from '../functions/judge/getTestCases';
import getTokens from '../functions/judge/getTokens';
import { IAssignmentFunctionResponse } from '../models/assignment.model';
import { Submission, SubmissionResponse, testcaseVerdict } from '../models/submissions.model';
import { generateRandomLargeInteger } from '../utils/randomGenerator';
import { updateContestScore } from '../functions/contest/updateContestScore';
import { IContestFunctionResponse } from '../models/contest.model';
import { checkAssignmentSubmissionDeadline } from '../functions/assignment/checkSubmissionDeadline';
import { checkContestSubmissionDeadline } from '../functions/contest/checkContestSubmissionDeadline';
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
                "expected_output": testCase.expectedOutput,
                "cpu_time_limit": 2,
            }));

            const submissionString = JSON.stringify(
                {
                    "submissions": submissionJson
                }
            );

            console.log(submissionString);;

            const tokens = await getTokens(submissionString) as Array<string>

            console.log("Tokens: ", tokens);
            const response = {
                ok: true,
                message: "Tokens generated successfully",
                data: tokens
            }
            res.json(
                new ApiResponse(
                    200,
                    response
                )
            );
        } catch (Error) {
            res.send(Error);
        }
    }

    // get the verdict of the submission
    // and store the submission in the database
    async storeSubmission(req: Request, res: Response) {
        const { submission, assignmentId, contestId, problemDifficulty } = req.body;
        const { user } = req.body;
        const userRollNumber = user.userRollNumber;
        let cnt = 0;
        const submissionTestcasesVerdict: testcaseVerdict[] = submission.submissionTestcasesVerdict;
        console.log(submissionTestcasesVerdict);
        console.log(assignmentId, contestId);
        submissionTestcasesVerdict.forEach((verdict: testcaseVerdict) => {
            if (verdict.status === "Accepted") {
                cnt++;
            }
        });
        console.log(submissionTestcasesVerdict);
        const newSubmission = new Submission({
            submissionId: generateRandomLargeInteger(),
            submissionSourceCode: submission.submissionSourceCode,
            submissionLanguageId: submission.submissionLanguageId,
            submissionProblemId: submission.submissionProblemId,
            submissionStatus: `${cnt}/${submissionTestcasesVerdict.length}`,
            submissionUserRollNumber: userRollNumber,
            submissionTestcasesVerdict: submission.submissionTestcasesVerdict
        });
        let maxMarks = 0;
        if (problemDifficulty === "Easy") {
            maxMarks = 20;
        } else if (problemDifficulty === "Medium") {
            maxMarks = 40;
        } else if (problemDifficulty === "Hard") {
            maxMarks = 80;
        }
        // if submission is related to assignment than update the score in assignment
        if (assignmentId) {
            // check if the time of submission is within the deadline
            const isWithinDeadline = await checkAssignmentSubmissionDeadline(Number(assignmentId), new Date());
            if (isWithinDeadline === false) {
                return res.status(200).json(new ApiError(400, "Submission deadline has passed"));
            }
            // updateAssignmentScore(assignmentId, userId, problemId, cnt);
            const marks = Math.round((cnt / submissionTestcasesVerdict.length) * maxMarks);
            const response: IAssignmentFunctionResponse = await updateAssignmentScore(Number(assignmentId), userRollNumber, Number(submission.submissionProblemId), marks);
            if (!response.ok) {
                return res.status(200).json(new ApiError(400, response.message));
            }
        }
        // if submission is related to contest than update the score in contest
        if (contestId) {
            // check if the time of submission is within the deadline
            const isWithinDeadline = await checkContestSubmissionDeadline(Number(contestId), new Date());
            if (isWithinDeadline === false) {
                return res.status(200).json(new ApiError(400, "Submission deadline has passed"));
            }
            // updateContestScore(contestId, userId, problemId, cnt);
            const marks = Math.round((cnt / submissionTestcasesVerdict.length) * maxMarks);
            const response: IContestFunctionResponse = await updateContestScore(Number(contestId), userRollNumber, Number(submission.submissionProblemId), marks);
            if (!response.ok) {
                return res.status(200).json(new ApiError(400, response.message));
            }
        }
        newSubmission.save();
        const response = {
            ok: true,
            message: "Submission stored successfully",
            data: newSubmission
        }
        res.json(
            new ApiResponse(
                200,
                response
            )
        );
    }

    async getSubmissions(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const submissions = await Submission.find({ submissionUserRollNumber: user.userRollNumber });
            const response = {
                ok: true,
                message: "Submissions fetched successfully",
                data: submissions
            }
            res.json(
                new ApiResponse(
                    200,
                    response
                )
            );
        } catch (Error) {
            res.send(new ApiError(400, "Error fetching submissions"));
        }
    }
}

export const judgeController = new JudgeController();