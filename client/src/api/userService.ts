export class UserService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getUsersFromSection(section: string) {
        const response = await fetch(`${this.url}/api/v1/users/getUsersFromSection`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ section }),
        });
        return await response.json();
    }

    async getUser(userRollNumber: string) {
        const response = await fetch(`${this.url}/api/v1/users/getUser/${userRollNumber}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    }

    async editUser(userEmail: string, userName: string, userRollNumber: string, userSection: string, userTeamName: string) {
        const response = await fetch(`${this.url}/api/v1/users/edituser/${userRollNumber}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, userName, userRollNumber, userSection, userTeamName }),
        });
        return await response.json();
    }

    async deleteUser(userEmail: string) {
        const response = await fetch(`${this.url}/api/v1/users/deleteuser/${userEmail}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail }),
        });
        return await response.json();
    }

    async changeUserSecret(userEmail: string) {
        const response = await fetch(`${this.url}/api/v1/users/changeUserSecret`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ userEmail }),
        });
        return await response.json();
    }
}

export const userService = new UserService();