const { getInformationProfile, updateInformationProfile, findProfileByRegex, getListFriendsPublic, getListFriendsPrivate, findProfilePublic, rejectFriendRequest } = require('../services/profile.service');
const { CREATED, SuccessResponse } = require('../utils/responses/success.response');
const { sendFriendRequest, acceptFriendRequest } = require('../services/profile.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}
class ProfileController {

    findProfilePublic = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find profile success',
            metadata: await findProfilePublic(req)
        }).send(res)
    }


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
            metadata: await sendFriendRequest(req)
        }).send(res)
    }

    acceptFriendRequest = async (req, res, next) => {
        new SuccessResponse({
            message: 'Accepted friend request',
            metadata: await acceptFriendRequest(req)
        }).send(res)
    }

    rejectFriendRequest = async (req, res, next) => {
        new SuccessResponse({
            message: 'Rejected friend request',
            metadata: await rejectFriendRequest(req)
        }).send(res)
    }

    getListFriendsPublic = async (req, res, next) => {
        new SuccessResponse({
            message: 'List friends public',
            metadata: await getListFriendsPublic(req)
        }).send(res)
    }

    getListFriendsPrivate = async (req, res, next) => {
        new SuccessResponse({
            message: 'List friends private',
            metadata: await getListFriendsPrivate(req)
        }).send(res)
    }







}


module.exports = new ProfileController()