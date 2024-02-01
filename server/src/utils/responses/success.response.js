const statusCode = {
    CONTINUE: 100,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
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
    PARTIAL_CONTENT: "Partial Content",
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

class SuccessResponse {
    constructor({ message, status = statusCode.OK, contentStatus = reasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? contentStatus : message;
        this.status = status;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}


class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, status = statusCode.CREATED, contentStatus = reasonStatusCode.CREATED, metadata, options = {} }) {
        super({ message, status, contentStatus, metadata });
        this.options = options;
    }
}

class CONTINUE extends SuccessResponse {
    constructor({ message, status = statusCode.CONTINUE, contentStatus = reasonStatusCode.CREATED, metadata }) {
        super({ message, status, contentStatus, metadata });
    }
}

class NO_CONTENT extends SuccessResponse {
    constructor({ message, status = statusCode.NO_CONTENT, contentStatus = reasonStatusCode.NO_CONTENT, metadata }) {
        super({ message, status, contentStatus, metadata });
    }
}

class PARTIAL_CONTENT extends SuccessResponse {
    constructor({ message = reasonStatusCode.PARTIAL_CONTENT, status = statusCode.PARTIAL_CONTENT, metadata }) {
        super({ message, status, contentStatus, metadata });
    }
}

module.exports = {
    OK,
    CONTINUE,
    CREATED,
    NO_CONTENT,
    PARTIAL_CONTENT,
}