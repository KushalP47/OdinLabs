export class UserService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_API_URL;
    }

    async getUsersFromSection(section: string) {
        const response = await fetch(`${this.url}/users/getUsersFromSection`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ section }),
        });
        return await response.json();
    }

    async editUser(userEmail: string, userName: string, userRollNumber: string, userSection: string, userTeamName: string) {
        const response = await fetch(`${this.url}/users/edituser/${userEmail}`, {
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
        const response = await fetch(`${this.url}/users/deleteuser/${userEmail}`, {
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
        const response = await fetch(`${this.url}/users/changeUserSecret`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail }),
        });
        return await response.json();
    }
}

export const userService = new UserService();