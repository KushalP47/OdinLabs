import axios from "axios";
export class CodeExecutionService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_RAPIDAPI_URL;
    }
    async executeCode(code: string, language: number, input: string) {
        const reqBody = { code, language, input };
        const options = {
            method: "POST",
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
            data: reqBody,
        };
        const response = await axios
            .request(options)
        // .then(function (response) {
        //     console.log("res.data", response.data);
        //     const token = response.data.token;
        //     checkStatus(token);
        // })
        // .catch((err) => {
        //     let error = err.response ? err.response.data : err;
        //     setProcessing(false);
        //     console.log(error);
        // });
        console.log("response", response);
        return response.data.json();
    }

    async checkStatus(token: string) {
        const options = {
            method: "GET",
            params: { token },
            url: `${this.url}/${token}`,
            headers: {
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            }
        };
        const response = await axios
            .request(options)

        return response.data.json();
    }
}

export const codeExecutionService = new CodeExecutionService();