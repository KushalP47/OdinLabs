export class AssignmentService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getAllAssignments() {
        const response = await fetch(`${this.url}/api/v1/assignments/getAllAssignments`, {
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
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ problemIds: problemsIds }),
        });
        return response.json();
    }

    async createAssignment(assignment: any) {
        const response = await fetch(`${this.url}/api/v1/assignments/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(assignment),
        });
        return response.json();
    }

    async updateAssignment(assignmentId: any, assignment: any) {
        const response = await fetch(`${this.url}/api/v1/assignments/${assignmentId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(assignment),
        });
        return response.json();
    }

    async getAssignmentDeadline(assignmentId: string) {
        const response = await fetch(`${this.url}/api/v1/assignments/getAssignmentDeadline/${assignmentId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }
}

export const assignmentService = new AssignmentService();

