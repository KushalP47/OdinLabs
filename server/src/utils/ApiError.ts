class ApiError extends Error {
    statusCode: number;
    data: any; // Consider using a more specific type if possible
    success: boolean;
    errors: Array<any>; // Consider using a more specific type if possible

    constructor(
        statusCode: number,
        message: string = "Somethings went wrong",
        errors: Array<any> = [],
        stack: string = "",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message; // This is already set by super(message), but you can keep it if you need to do something specific with it.
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };