const { findFriendByNameRegex } = require('../services/friend.service');
const { getInformationProfile, updateInformationProfile, findProfileByRegex, getListFriends } = require('../services/profile.service');
const { CREATED, SuccessResponse } = require('../utils/responses/success.response');
const { sendFriendRequest, acceptFriendRequest } = require('../services/friend.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}
class ProfileController {


    getInformationProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get information profile is successfully',
            metadata: await getInformationProfile(req.headers)
        }).send(res)
    }

    updateInformationProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Updated info profile is successfully',
            metadata: await updateInformationProfile(req)
        }).send(res)
    }

    sendFriendRequest = async (req, res, next) => {
        new SuccessResponse({
            message: 'Request friend success',
            metadata: await sendFriendRequest(req.body)
        }).send(res)
    }

    acceptFriendRequest = async (req, res, next) => {
        new SuccessResponse({
            message: 'Accepted friend request',
            metadata: await acceptFriendRequest(req.body)
        }).send(res)
    }

    getListFriends = async (req, res, next) => {
        new SuccessResponse({
            message: 'List friends',
            metadata: await getListFriends(req)
        }).send(res)
    }







}


module.exports = new ProfileController()