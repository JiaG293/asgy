const { getInformationUser } = require("../services/user.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class UsersController {

    //
    getInformationUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get information user is successfully',
            metadata: await getInformationUser(req.body)
        }).send(res)
    }


}


module.exports = new UsersController()