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
        return response.json();
    }

    async getPracticeProblem(problemId: string,) {
        const response = await fetch(`${this.url}/api/v1/problems/practice/${problemId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
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
        return response.json();
    }

    async getEditorialById(problemId: string) {
        const editorialId = problemId;
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${editorialId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );

        return response.json();
    }

    async changeProblemEditorialStatus(problemId: string, problemEditorialIsHidden: boolean) {
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}/${problemEditorialIsHidden}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );

        return response.json();
    }

    async createProblem(problem: any) {
        const response = await fetch(`${this.url}/api/v1/problems/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
                body: JSON.stringify(problem),
            }
        );
        return response.json();
    }

    async updateProblem(problemId: string, problem: any) {
        const response = await fetch(`${this.url}/api/v1/problems/update/${problemId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
                body: JSON.stringify(problem),
            }
        );
        return response.json();
    }

}

export const problemService = new ProblemService();