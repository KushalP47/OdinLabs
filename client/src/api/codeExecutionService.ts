import { getCookie } from "../lib/cookieUtility";
export class CodeExecutionService {
    url;
    serverUrl;
    constructor() {
        this.url = import.meta.env.VITE_RAPIDAPI_URL;
        this.serverUrl = import.meta.env.VITE_SERVER_URL;
    }
    async executeCode(code: string, language: number, input: string, languageName: string) {
        const reqBody = JSON.stringify({ source_code: code, language_id: language, stdin: input });
        console.log(this.url, reqBody)
        const options = {
            method: "POST",
            params: { base64_encoded: `${languageName === 'cpp' ? 'true' : 'false'}` },
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
            body: reqBody,
        };
        const response = await fetch(this.url, options);
        console.log("response", response);
        return response.json();
    }

    async submitCode(code: string, language: number, problemId: number) {
        const userCookie = getCookie("accessToken");
        const reqBody = JSON.stringify({ sourceCode: code, languageId: language, problemId: problemId });
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
            body: reqBody,
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/submit`;
        // will get array of tokens
        const response = await fetch(apiUrl, options);
        return response.json();
    }

    async storeSubmission(submission: any, assignmentId: string | undefined, contestId: string | undefined, problemDifficulty: string) {
        const userCookie = getCookie("accessToken");
        console.log("sending submission", submission);
        const reqBody = JSON.stringify({ submission: submission, assignmentId, contestId, problemDifficulty });
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
            body: reqBody,
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/storeSubmission`;
        const response = await fetch(apiUrl, options);
        return response.json();
    }

    async checkStatus(token: string) {
        const url = `${this.url}/${token}?base64_encoded=true`;
        console.log("url", url);
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            }
        };
        const response = await fetch(url, options);
        console.log("response", response);
        return response.json();
    }

    async getSubmissions() {
        const userCookie = getCookie("accessToken");
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/getSubmission`;
        const response = await fetch(apiUrl, options);
        return response.json();
    }

    async getContestUserProblemStatus(problemId: string, userRollNumber: string) {
        const userCookie = getCookie("accessToken");
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/getContestUserProblemStatus/${problemId}/${userRollNumber}`;
        const response = await fetch(apiUrl, options);
        return response.json();
    }

}

export const codeExecutionService = new CodeExecutionService();