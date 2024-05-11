const AccessService = require("../services/access.service");
const { verifyTokenValidAccount } = require("../services/validAccount.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class AccessController {


    //Forgot password
    forgotPassword = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send token to email success',
            metadata: await AccessService.forgotPassword(req)
        }).send(res)
    }

    //Get token from email 
    resetPassword = async (req, res, next) => {
        new SuccessResponse({
            message: 'Reset Password Success',
            metadata: await AccessService.resetPassword(req.params.token, req.body.password)
        }).send(res)
    }

    //Handle refresh token 
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get token is successfully',
            metadata: await AccessService.handleRefreshTokenService(req)
        }).send(res)
    }
    //Logout 
    logoutUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout is successfully',
            metadata: await AccessService.logoutUser(req.keyStore)
        }).send(res)
        console.log(req.keyStore);
    }

    //Login 
    loginUser = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.loginUser(req.body)
        }).send(res)
    }

    //signupUser
    signupUser = async (req, res, next) => {

        //Cach cu khong dung utils handler response
        /*  console.log('AccessController signup user:', req.body);
         return res.status(201).json(await AccessService.signUpUser(req.body)) */

        new CREATED({
            message: 'Registed is successfully',
            metadata: await AccessService.signUpUser(req.body)
        }).send(res)

    }

    //check username, email, phoneNumber xem co trung khong
    checkPromptSignUp = async (req, res, next) => {
        new SuccessResponse({
            message: 'Check success',
            metadata: await AccessService.checkPromptSignUp(req.body)
        }).send(res)
    }

    //lay thong tin chi tiet tai khoan bao mat nguoi dung
    getInformationDetails = async (req, res, next) => {
        new SuccessResponse({
            message: 'Details information users',
            metadata: await AccessService.getInformationDetails(req.headers)
        }).send(res)
    }

    //create OTP
    createOtp = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create OTP success',
            metadata: await AccessService.createOtp(req)
        }).send(res)
    }

    //verify OTP
    verifyOtp = async (req, res, next) => {
        new SuccessResponse({
            message: 'Details information users',
            metadata: await AccessService.verifyOtp(req.body)
        }).send(res)
    }

    //verify OTP
    test = async (req, res, next) => {

        new SuccessResponse({
            message: 'Details information users',
            metadata: await verifyTokenValidAccount(req.body.token)
        }).send(res)
    }

}


module.exports = new AccessController()