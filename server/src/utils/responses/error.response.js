
const statusCode = {
    CONTINUE: 100,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
}

const reasonStatusCode = {
    CONTINUE: "Continue",
    OK: "OK",
    CREATED: "Created",
    ACCEPTED: "Accepted",
    NO_CONTENT: "No Content",
    RESET_CONTENT: "Reset Content",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict",
    TOO_MANY_REQUESTS: "Too Many Requests",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    NOT_IMPLEMENTED: "Not Implemented",
    BAD_GATEWAY: "Bad Gateway",
    SERVICE_UNAVAILABLE: "Service Unavailable",
    GATEWAY_TIMEOUT: "Gateway Timeout"
}





class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, status = statusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.BAD_REQUEST, status = statusCode.BAD_REQUEST) {
        super(message, status);
    }
}

class UnauthorizeError extends ErrorResponse {
    constructor(message = reasonStatusCode.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    UnauthorizeError
}