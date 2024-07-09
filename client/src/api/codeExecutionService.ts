
export class CodeExecutionService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_RAPIDAPI_URL;
    }
    async executeCode(code: string, language: number, input: string) {
        const reqBody = JSON.stringify({ source_code: code, language_id: language, stdin: input });
        console.log(this.url, reqBody)
        const options = {
            method: "POST",
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

    async checkStatus(token: string) {
        const url = `${this.url}/${token}`;
        console.log("url", url);
        const options = {
            method: "GET",
            params: { base64_encoded: "true" },
            // url: `${this.url}/${token}`,
            headers: {
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            }
        };
        const response = await fetch(url, options);
        console.log("response", response);
        return response.json();
    }
}

export const codeExecutionService = new CodeExecutionService();