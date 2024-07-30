export class ContestService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getAllContests() {
        const response = await fetch(`${this.url}/api/v1/contests/getAllContests`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getContest(contestId: string) {
        const response = await fetch(`${this.url}/api/v1/contests/${contestId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getContestProblems(problemsIds: number[]) {
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

    async createContest(contest: any) {
        const response = await fetch(`${this.url}/api/v1/contests/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contest),
        });
        return response.json();
    }

    async getContestDeadline(contestId: string) {
        const response = await fetch(`${this.url}/api/v1/contests/getContestDeadline/${contestId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async updateContest(contestId: string, contest: any) {
        const response = await fetch(`${this.url}/api/v1/contests/${contestId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contest),
        });
        return response.json();
    }

    async deleteContest(contestId: string) {
        const response = await fetch(`${this.url}/api/v1/contests/delete/${contestId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async signInContest(contestId: string) {
        const response = await fetch(`${this.url}/api/v1/contests/signIn/${contestId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async logContestActivity(contestId: string, activity: string) {
        const response = await fetch(`${this.url}/api/v1/contests/logActivity/${contestId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ activity }),
        });
        return response.json();
    }

    async getContestActivity(contestId: string) {
        const response = await fetch(`${this.url}/api/v1/contests/getActivity/${contestId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async retainContestUser(contestId: string, contestUserRollNumber: string) {
        const response = await fetch(`${this.url}/api/v1/contests/retainUser`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contestId, userRollNumber: contestUserRollNumber }),
        });
        return response.json();

    }

    async updateContestDeadline(contest: any) {
        const response = await fetch(`${this.url}/api/v1/contests/updateDeadline`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contest),
        });
        return response.json();
    }

};

export const contestService = new ContestService();