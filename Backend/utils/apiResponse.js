class ApiResponse {
    constructor(message = "Success", data, statusCode) {
        this.data = data,
        this.message = message,
        this.statusCode = statusCode,
        this.success = statusCode < 400 
    }
}

export{ ApiResponse }