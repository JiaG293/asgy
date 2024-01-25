const forgotPassword = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetPasswordToken = await user.getResetPasswordToken()

    await user.save();

    const resetPasswordUrl = `http://${req.get("host")}/password/reset/${resetPasswordToken}`;

    try {
        const checkSending = await sendEmail({
            email: user.email,
            subject: 'RESET PASSWORD',
            content: resetPasswordUrl
        });
        if (checkSending.success) {
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`,
            })
        }


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});