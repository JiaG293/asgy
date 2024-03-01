const { getInformationProfile } = require("../services/profile.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class ProfileController {

    //
    getInformationProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get information profile is successfully',
            metadata: await getInformationProfile(req.body)
        }).send(res)
    }


}


module.exports = new ProfileController()