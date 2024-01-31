const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler.util");
const catchAsync = require("./catchAsync.middleware");

const isAuthenticated = catchAsync(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to Access", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});


module.exports = {
    isAuthenticated,
}

