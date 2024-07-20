export class AssignmentService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getAllAssignments() {
        const response = await fetch(`${this.url}/api/v1/assignments`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAssignment(assignmentId: string) {
        const response = await fetch(`${this.url}/api/v1/assignments/${assignmentId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAssignmentProblems(problemsIds: number[]) {
        const response = await fetch(`${this.url}/api/v1/problems/getProblemByIds`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ problemIds: problemsIds }),
        });
        return response.json();
    }

    async createAssignment(assignment: any) {
        const response = await fetch(`${this.url}/api/v1/assignments`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(assignment),
        });
        return response.json();
    }
}

export const assignmentService = new AssignmentService();

