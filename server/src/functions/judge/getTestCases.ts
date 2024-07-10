import { Problem, Testcase } from "../../models/problem.model";

export default async function getTestCases(problemId: number): Promise<Array<Testcase>> {
    try {
        const problemDocs = await Problem.find({ problemId });
        if (!problemDocs || problemDocs.length === 0) {
            throw new Error('Problem not found');
        }
        console.log("Problem: ", problemDocs);
        const testCases: Array<Testcase> = problemDocs[0].problemTestcases;
        return testCases;
    } catch (error) {
        console.error(error);
        throw error;
    }
}