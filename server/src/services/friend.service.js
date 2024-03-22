const ProfileModel = require('../models/profile.model')
const FriendModel = require('../models/friend.model');
const { BadRequestError, ConflictRequestError } = require('../utils/responses/error.response');
const mongoose = require('mongoose');

//GUI YEU CAU KET BAN
const sendFriendRequest = async ({ profileIdSend, profileIdReceive }) => {
    //1. Kiem tra yeu cau ton tai hay chua 
    const requestExists = await FriendModel.findOne({ profileId: profileIdSend, 'profileFriend.profileFriendId': profileIdReceive });

    if (requestExists) {
        throw new ConflictRequestError('Request make friend is exists')
    }

    // 2. Lay du lieu profile id muon ket ban
    const getDataProfile = await ProfileModel.findOne({ _id: profileIdReceive }).select('-_id birthday gender fullName info avatar').lean()

    if (!getDataProfile) {
        throw new BadRequestError("Not found profile")
    }
    // 3. Tao yeu cau ket ban neu chua ton tai
    const newFriendRequest = new FriendModel({
        profileId: profileIdSend,
        profileFriend: {
            profileFriendId: profileIdReceive,
            ...getDataProfile,
        },
        status: 'Đang chờ chấp nhận'
    });

    //4. Luu vao database
    await newFriendRequest.save();

    //5. Them phan tao thong bao 


    return newFriendRequest
}

//CHAP NHAN KET BAN
const acceptFriendRequest = async ({ profileIdReceive, profileIdSend }) => {

    //KHONG DUNG TRANSACTION

    /* //1. Lay ra yeu cau ket ban
    const friendRequest = await FriendModel.findOne({ profileId: userIdSend, 'profileFriend.profileFriendId': userIdReceive });
 
    if (!friendRequest) {
        throw new BadRequestError('Friend request not found');
    }
 
    //2. Tao quan he ban be giua 2 nguoi dung 
    await ProfileModel.findOneAndUpdate(
        { userId: userIdSend },
        { $addToSet: { friend: userIdReceive } },  //Dua du lieu moi vao trong mang va khong bi trung lap
        { new: true }
    );
 
    await ProfileModel.findOneAndUpdate(
        { userId: userIdReceive },
        { $addToSet: { friend: userIdSend } },  //Dua du lieu moi vao trong mang va khong bi trung lap
        { new: true }
    )
 
    //3. Xoa khoi hang doi
    await friendRequest.remove()
 
    //4. Them phan thong bao 
    return true */


    //DUNG TRANSACTION

    //1. Lay ra yeu cau ket ban
    const friendRequest = await FriendModel.findOne({ profileId: profileIdSend, 'profileFriend.profileFriendId': profileIdReceive })

    if (!friendRequest) {
        throw new BadRequestError('Friend request not found');
    }


    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        //Lay ra profile id
        /* const senderProfileId = await ProfileModel.findOne({ _id: profileIdSend }).select('_id')
        const receiverProfileId = await ProfileModel.findOne({ userId: profileIdReceive }).select('_id') */

        //2. Tao quan he ban be giua 2 nguoi dung 
        await ProfileModel.findOneAndUpdate(
            { _id: profileIdSend },
            { $addToSet: { friends: profileIdReceive } },  //Dua du lieu moi vao trong mang va khong bi trung lap
            { new: true }
        ).session(session);


        await ProfileModel.findOneAndUpdate(
            { _id: profileIdReceive },
            { $addToSet: { friends: profileIdSend } },  //Dua du lieu moi vao trong mang va khong bi trung lap
            { new: true }
        ).session(session);

        //3. Xoa khoi hang doi
        await friendRequest.remove({ session });

        // Commit transaction nếu không có lỗi xảy ra
        await session.commitTransaction();
        session.endSession();

        //4. Them phan thong bao 

        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new BadRequestError('Error accepting friend request');
    }

}



const findFriendByNameRegex = async (name, userId) => {
    const regex = new RegExp(name, 'i');
    return await FriendModel.find({ profileId: userId, fullName: { $regex: regex } });
}

const findFriendByRegex = async (stringFind) => {

    if (stringFind?.name) {
        const regexName = new RegExp(stringFind.name, 'i');
        return await FriendModel.find({ profileId: userId, fullName: { $regex: regex } })
    }

    if (stringFind?.phoneNumber) {
        const regexPhoneNumber = new RegExp(stringFind.phoneNumber, 'i');
        return await FriendModel.find({ profileId: userId, fullName: { $regex: regex } })
    }
}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    findFriendByNameRegex,
    findFriendByRegex,

}