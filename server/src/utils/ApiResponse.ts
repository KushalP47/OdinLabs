class ApiResponse {
    statusCode: number;
    data: any; // Consider using a more specific type if possible
    success: boolean;
    message: string;
    serverTime: string;
    constructor(statusCode: number, data: any, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
        this.serverTime = new Date().toISOString()
    }
}
export { ApiResponse };