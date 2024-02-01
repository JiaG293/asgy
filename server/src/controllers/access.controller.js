const AccessService = require("../services/access.service");
const { CREATED } = require("../utils/responses/success.response");

class AccessController {
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