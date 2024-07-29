import { getCookie } from '../lib/cookieUtility';

class ProblemService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getProblems() {
        console.log(this.url);
        const response = await fetch(`${this.url}/api/v1/problems/all`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        console.log(response);
        if (!response.ok) {
            throw new Error("Error fetching problems");
        }
        return response.json();
    }

    async getProblem(problemId: string) {
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        if (!response.ok) {
            throw new Error("Error fetching problem");
        }
        return response.json();
    }

    async changeProblemStatus(problemId: string, problemIsHidden: boolean) {
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}/${problemIsHidden}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        if (!response.ok) {
            throw new Error("Error changing problem status");
        }
        return response.json();
    }

}

export const problemService = new ProblemService();