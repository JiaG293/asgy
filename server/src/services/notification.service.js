const NotificationModel = require('../models/notification.model');
const { BadRequestError } = require('../utils/responses/error.response');


const pushNotification = async ({ notificationType, notificationSenderId, notificationReceiverId, options }) => {
    let notificationContent;
    if (notificationType === 'MESSAGE_SINGLE') {
        notificationContent = `Có một tin nhắn từ ${options.fullName}`
    } else if (notificationType === 'MESSAGE_GROUP') {
        notificationContent = `Có một tin nhắn mời từ nhóm ${options.name}`
    } else if (notificationType === 'FRIEND') {
        notificationContent = `Có một lời mời kết bạn từ ${options.fullName}`
    } else if (notificationType === 'SYSTEM') {
        notificationContent = `Thông báo từ hệ thống`
    } else { throw new BadRequestError("No type content notification") }

    const newNotification = NotificationModel.create({
        notificationType,
        notificationSenderId,
        notificationReceiverId,
        notificationContent,
        options,
    }).then(newNoti => {
        console.log('newNoti created:', newNoti._id);
        _profileConnected.get(String(newNoti.notificationReceiverId)).socketIds.forEach(socketId => {
            _io.to(socketId).emit('notify', newNoti)
        })

    }).catch(error => {
        console.error('Error create notification:', error);
    });

    return newNotification;
}

module.exports = {
    pushNotification,

}