const ProfileModel = require('../models/profile.model')
const FriendModel = require('../models/friend.model');
const { BadRequestError, ConflictRequestError } = require('../utils/responses/error.response');
const mongoose = require('mongoose');
const { decodeTokens } = require('../auth/authUtils');
const { deleteFileS3 } = require('./s3.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

//find profile all database
const findProfilePublic = async (req) => {
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID];
    const decodeToken = await decodeTokens(clientId, authorization);

    const { stringFind } = req.params;


    const listSearch = await findProfileByRegexString(stringFind);
    /* if (!listSearch) {
        throw new BadRequestError('User for profile not found');
    } */
    return listSearch
}


//LAY THONG TIN PROFILE
const getInformationProfile = async (headers) => {
    const { authorization } = await headers;
    const clientId = await headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    //find profile by _id profile
    /* const infoProfile = await ProfileModel.findOne({ _id: decodeToken.profileId })
        .select('-createdAt -updatedAt -listChannels').populate({
            path: 'friendsRequest.profileIdRequest',
            select: 'avatar fullName userId',
            populate: {
                path: 'userId',
                select: 'username'
            }
        })
        .lean()
        .then(result => ({
            ...result,
            friendsRequest: result.friendsRequest.map(profile => ({
                profileIdRequest: profile.profileIdRequest,
                avatar: profile.avatar,
                fullName: profile.fullName,
                requestDated: profile.requestDated,
            }))
        })) */
    const infoProfile = await ProfileModel.findOne({ _id: decodeToken.profileId })
        .select('-createdAt -updatedAt -listChannels')
        .populate({
            path: 'friendsRequest.profileIdRequest',
            select: 'avatar fullName userId',
            populate: {
                path: 'userId',
                select: 'username'
            }
        })
        .populate({
            path: 'friends.profileIdFriend',
            select: 'avatar fullName userId',
            populate: {
                path: 'userId',
                select: 'username'
            }
        })
        .lean()
        .then(result => ({
            ...result,
            friendsRequest: result.friendsRequest.map(profile => ({
                profileIdRequest: profile.profileIdRequest._id,
                avatar: profile.profileIdRequest.avatar,
                fullName: profile.profileIdRequest.fullName,
                requestDated: profile.requestDated,
                username: profile.profileIdRequest.userId.username,

            })),
            friends: result.friends.map(profile => ({
                ...profile.requestDated,
                profileIdFriend: profile.profileIdFriend._id,
                avatar: profile.profileIdFriend.avatar,
                fullName: profile.profileIdFriend.fullName,
                username: profile.profileIdFriend.userId.username,

            })),
        }));

    console.log(infoProfile)
    if (!infoProfile) {
        throw new BadRequestError('User for profile not found');
    }
    return infoProfile
}

//CAP NHAT THONG TIN PROFILE
const updateInformationProfile = async (req) => {
    const { fullName, gender, info, birthday, phoneNumber } = req.body
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    //AP DUNG TRANSACTION
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const update = {};
        const user = await findProfileByUserId(decodeToken.userId)
        if (fullName !== undefined) update.fullName = fullName;

        if (req?.file?.location !== undefined) {
            await deleteFileS3(user.avatar)
            update.avatar = await req.file.location;
        }
        if (gender !== undefined) update.gender = gender;
        if (info !== undefined) update.info = info;
        if (birthday !== undefined) update.birthday = birthday;
        if (phoneNumber !== undefined) update.phoneNumber = phoneNumber;
        console.log("update", update);

        const filter = { userId: decodeToken.userId }

        const options = { upsert: false, new: true }

        // Cap nhat thong tin trong bang profile 
        const profileUpdate = await ProfileModel.findOneAndUpdate(filter, update, options).session(session);

        // Cap nhat cac thong tin nhung trong bang friend
        await FriendModel.updateMany({ profileFriendId: decodeToken.profileId }, { $set: { 'profileFriend.$': update } }, options).session(session);

        await session.commitTransaction();
        session.endSession();

        return update;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new BadRequestError('Error updating profile information');
    }
}


//LAY RA DANH SACH BAN BE PUBLIC
const getListFriendsPublic = async (req) => {
    //Cach cu req.body.
    // return await ProfileModel.findOne({ _id: req.params.profileId }).select('userId friends').populate('friends', '-friends -createdAt -updatedAt -__v').lean()
    const profileFriendId = req.params?.profileFriendId
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    if (profileFriendId) {
        console.log("GET LIST PROFILE FRIEND");
        return await ProfileModel
            .findOne({ _id: profileFriendId })
            .select('friends')
            .populate({
                path: 'friends.profileIdFriend',
                select: '_id fullName avatar phoneNumber '
            })
            .lean()
    }
    else {
        return await ProfileModel
            .findOne({ _id: decodeToken.profileId })
            .select('friends')
            .populate({
                path: 'friends.profileIdFriend',
                select: '_id fullName avatar phoneNumber '
            })
            .lean()
    }

}


//LAY RA DANH SACH BAN BE PRIVATE
const getListFriendsPrivate = async (req) => {
    //Cach cu req.body.
    // return await ProfileModel.findOne({ _id: req.params.profileId }).select('userId friends').populate('friends', '-friends -createdAt -updatedAt -__v').lean()
    const profileFriendId = req.params?.profileFriendId
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    if (profileFriendId) {
        console.log("GET LIST PROFILE FRIEND");
        return await ProfileModel
            .findOne({ _id: profileFriendId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }
    else {
        return await ProfileModel
            .findOne({ _id: decodeToken.profileId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }

}


//GUI YEU CAU KET BAN
const sendFriendRequest = async (req) => {

    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);
    const { profileIdReceive } = req.body

    // 1. Kiem tra trung nhau 
    if (decodeToken.profileId === profileIdReceive) {
        throw new ConflictRequestError("Do not request to yourself")
    }

    // 2. kiem tra profile id muon ket ban co ton tai khong
    const getDataProfile = await ProfileModel.findOne({ _id: profileIdReceive }).select('-_id birthday gender fullName info avatar').lean()
    if (!getDataProfile) {
        throw new BadRequestError("Not found profile request")
    }

    // 3. Kiem tra yeu cau ket ban co ton tai hay khong
    const requestExists = await ProfileModel.findOne({ _id: decodeToken.profileId, friendsRequest: { $elemMatch: { profileIdRequest: profileIdReceive } } }).lean()

    if (requestExists) {
        throw new ConflictRequestError('Request make friend is exists')
    }

    // 4. kiem tra xem da la ban be chua
    const friendExists = await ProfileModel.findOne({ _id: decodeToken.profileId, friends: { $elemMatch: { profileIdRequest: profileIdReceive } } }).lean()

    if (friendExists) {
        throw new ConflictRequestError('Friend is exists')
    }


    // 5. Tao yeu cau ket ban neu chua ton tai
    const newFriendRequest = await ProfileModel.findOneAndUpdate(
        {
            _id: profileIdReceive,
            'friendsRequest.profileIdRequest': { $ne: decodeToken.profileId }
        },
        {
            $addToSet: {
                friendsRequest: {
                    profileIdRequest: decodeToken.profileId,
                    requestDated: new Date()
                }
            }
        },
        { new: true }
    ).populate({
        path: 'friendsRequest.profileIdRequest',
        select: '_id fullName avatar userId',
        populate: {
            path: 'userId',
            select: 'name'
        }
    }).then(result => ({
        ...result,
        friendsRequest: result.friendsRequest.map(profile => ({
            profileIdRequest: profile.profileIdRequest._id,
            avatar: profile.profileIdRequest.avatar,
            fullName: profile.profileIdRequest.fullName,
            requestDated: profile.requestDated,
            username: profile.profileIdRequest.userId.username,

        })),
        friends: result.friends.map(profile => ({
            ...profile.requestDated,
            profileIdFriend: profile.profileIdFriend._id,
            avatar: profile.profileIdFriend.avatar,
            fullName: profile.profileIdFriend.fullName,
            username: profile.profileIdFriend.userId.username,

        })),
    }));

    if (!newFriendRequest) {
        throw new ConflictRequestError("Friend request exists")
    }

    //5. Them phan tao thong bao 
    const profileSocket = await _profileConnected.get(profileIdReceive)
    if (profileSocket == undefined) {
        profileSocket.forEach(elem => {
            _io.to(elem.socketIds).emit('createdRequestFriend', newFriendRequest)
        });
    }


    console.log("profile socket", profileSocket, typeof (profileSocket));
    return newFriendRequest.friendsRequest
}

//CHAP NHAN KET BAN
const acceptFriendRequest = async (req) => {
    //temp
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    const { profileIdSend } = req.body

    //DUNG TRANSACTION
    console.log("profileID send ", profileIdSend);

    //1. Lay ra yeu cau ket ban
    const friendRequest = await ProfileModel.findOne({
        _id: decodeToken.profileId,
        'friendsRequest': { $elemMatch: { profileIdRequest: profileIdSend } }
    })

    if (!friendRequest) {
        throw new BadRequestError('Friend request not found');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const datedNow = Date.now();

        console.log("1. xoa yeu cau ket ban o hang doi");
        //xoa yeu cau ket ban o hang doi
        await ProfileModel.findOneAndUpdate(
            { _id: decodeToken.profileId },
            {
                $pull: {
                    friendsRequest: {
                        profileIdRequest: profileIdSend
                    }
                }
            },
            { new: true }
        ).session(session);

        console.log("2. them friend danh cho nguoi chap nhan ket ban");
        //them friend danh cho nguoi chap nhan ket ban
        await ProfileModel.findOneAndUpdate(
            { _id: decodeToken.profileId },
            {
                $addToSet: {
                    friends: {
                        profileIdFriend: profileIdSend,
                        friendDated: datedNow
                    }
                }
            },  //Dua du lieu moi vao trong mang va khong bi trung lap
            { new: true }
        ).session(session);

        console.log("3. them friend danh cho nguoi gui ket ban");
        //them friend danh cho nguoi gui ket ban
        await ProfileModel.findOneAndUpdate(
            { _id: profileIdSend },
            {
                $addToSet: {
                    friends: {
                        profileIdFriend: decodeToken.profileId,
                        friendDated: datedNow
                    }
                }
            },
            { new: true }
        ).session(session);

        // Commit transaction nếu không có lỗi xảy ra
        await session.commitTransaction();
        session.endSession();

        //4. Them phan thong bao 

        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new BadRequestError('Error accepting friend request');
    }

}



const findByPhoneNumber = async ({ phoneNumber }) => {
    return await ProfileModel.findOne({ phoneNumber: phoneNumber }).lean()
}

const findProfileByUserId = async (userId) => {
    return await ProfileModel.findOne({ userId: userId }).lean()
}

const findProfileById = async (profileId) => {
    return await ProfileModel.findOne({ _id: profileId }).lean()
}

const findProfileByRegex = async (stringFind) => {
    if (stringFind?.name) {
        const regexName = new RegExp(stringFind.name, 'i')
        return await ProfileModel.find({ fullName: { $regex: regexName } })
    }
    if (stringFind?.phoneNumber) {
        const regexPhoneNumber = new RegExp(stringFind.phoneNumber, 'i')
        return await ProfileModel.find({ phoneNumber: { $regex: regexPhoneNumber } })
    }

}

const findProfileByRegexString = async (stringFind) => {
    const regexString = new RegExp(stringFind, 'i')
    console.log(regexString);
    return await ProfileModel.aggregate([
        {
            $project: {
                updatedAt: 0,
                createdAt: 0,
                listChannels: 0,
                friends: 0,
            }
        },
        {
            $lookup: {
                from: 'Users',  // tu collection muon join
                localField: 'userId',  // key trong this.collection
                foreignField: '_id',  // key trong collection muon join
                as: 'user_details'  // key ket qua join
            }
        },
        {
            $addFields:
            {
                user_details:
                {
                    $arrayElemAt: ["$user_details", 0]
                }
            }
        },
        {
            $match:
            {
                $or: [
                    { 'user_details.username': { $regex: regexString } },
                    { phoneNumber: { $regex: regexString } }
                ]
            }
        },
        {
            $project: {
                'user_details.password': 0,
                'user_details.email': 0,
                'user_details.updatedAt': 0,
                'user_details.createdAt': 0,
                'user_details._id': 0,
            }
        }
    ])
}



module.exports = {
    findProfileById,
    findByPhoneNumber,
    findProfileByUserId,
    getInformationProfile,
    updateInformationProfile,
    findProfileByRegex,
    getListFriendsPublic,
    getListFriendsPrivate,
    findProfilePublic,
    findProfileByRegexString,


    //test
    sendFriendRequest,
    acceptFriendRequest,

}