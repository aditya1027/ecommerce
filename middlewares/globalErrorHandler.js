export const globalErrorHandler = (err, req, res, next) => {
    const stack = err.stack;
    const message = err.message;
    const statusCode = err.status ? err.status : 500;
    res.status(statusCode).json({
        stack,
        message
    });
}

//404 Handler
export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
}