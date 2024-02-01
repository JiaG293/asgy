const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class AccessController {

    //Login 
    loginUser = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.loginUser(req.body)
        }).send(res)
    }


    signupUser = async (req, res, next) => {

        //Cach cu khong dung utils handler response
        /*  console.log('AccessController signup user:', req.body);
         return res.status(201).json(await AccessService.signUpUser(req.body)) */

        new CREATED({
            message: 'Registed is successfully',
            metadata: await AccessService.signUpUser(req.body)
        }).send(res)

    }

}


module.exports = new AccessController()