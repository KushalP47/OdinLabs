import { User } from "../types/user";
export class AuthService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }
    async register(user: User) {
        const reqBody = { email: user.email, password: user.password, name: user.name, rollNumber: user.rollNumber };
        const response = await fetch(`${this.url}/api/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        if (response.status === 200)
            return this.login(user);
        return response.json();
    }
    async login(data: any) {
        console.log("from authService: ", data);
        console.log(this.url);
        const reqBody = { email: data.email, password: data.password };
        const response = await fetch(`http://localhost:8000/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        return response.json();
    }
    async logout() {
        const response = await fetch(`${this.url}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    }
}

export const authService = new AuthService();