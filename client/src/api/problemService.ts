import { Problem, Testcase } from '../types/problems';

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
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
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
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            }
        );
        if (!response.ok) {
            throw new Error("Error fetching problem");
        }
        return response.json();
    }

}

export const problemService = new ProblemService();