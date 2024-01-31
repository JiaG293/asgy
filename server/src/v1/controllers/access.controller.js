const AccessService = require("../services/access.service");

class AccessController {
    signupUser = async (req, res, next) => {
        try {
            console.log('AccessController signup user:', req.body);
            return res.status(201).json(await AccessService.signUpUser(req.body))
        } catch (error) {
            next(error)
        }
    }

}


module.exports = new AccessController()