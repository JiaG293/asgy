
setCookie()

//Dung headers khi xac thuc thong tin
const socket = io('http://localhost:5000', {
    withCredentials: true,
    //Gui kem header de xac thuc thong tin

    extraHeaders: {
        "x-client-id": sessionStorage.getItem('clientId'),
        "authorization": sessionStorage.getItem('authorization')
    }
});
console.log("INFO connect io:", socket);
var storageListMessage = []

//Kiem tra xem co loi authentication khong
socket.on("errorAuthentication", (err) => {
    // setSocketError(err?.message);
    console.log(err);
});



loginUser()
getListMessage()
getMessage()




function setCookie() {
    var urlParams = new URLSearchParams(window.location.search);
    var dataString = urlParams.get('data');
    var dataPassed = JSON.parse(decodeURIComponent(dataString));
    const { profileId, channels, accessToken, clientId } = dataPassed
    sessionStorage.setItem('authorization', accessToken);
    sessionStorage.setItem('clientId', clientId);
    sessionStorage.setItem('profileId', profileId);
    console.log("\ndata params:::", dataPassed);
}

function loginUser() {
    var urlParams = new URLSearchParams(window.location.search);
    var dataString = urlParams.get('data');
    var dataPassed = JSON.parse(decodeURIComponent(dataString));
    const { profileId, channels, accessToken, clientId } = dataPassed
    //goi lai de lay channels add vao - tren kia chi goi api de lay 
    socket.emit('addUser', { profileId, channels })
    addGroup(channels, profileId)
    socket.emit('loadMessages', {
        senderId: sessionStorage.getItem('profileId')
    })
}

//them id dinh danh group cho moi element
async function addGroup(channels, profileId) {
    channels.map(channel => {
        let templateGroup = `
            <div class="group" id="${channel}-group">
                <div class="group-icon prevent-click-event">
                    <img id="group-icon-img" src="https://i.imgur.com/fL8RNta.png">
                </div>
                <div class="group-content prevent-click-event">
                    <div class="group-name prevent-click-event">${channel}</div>
                    <div class="group-last-message prevent-click-event">${channel.slice(-10)}</div>
                </div>
            </div>
            `
        let templateChatGroup = `
            <li>
                <ul id="${channel}-chat" class="message-list hidden" id-channel-chats="test">
                </ul>
            </li>
            `
        document.getElementById("sidebar").insertAdjacentHTML('beforeend', templateGroup);
        document.getElementById("chat-list").insertAdjacentHTML('beforeend', templateChatGroup);
    });
    /*  await socket.emit('loadListDetailsChannels', profileId)
     await socket.on('getListDetailsChannels', (data) => {
         data.map(channel => {
             let templateGroup = `
                 <div class="group" id="${channel}-group">
                     <div class="group-icon prevent-click-event">
                         <img id="group-icon-img" src="${channel.icon}">
                     </div>
                     <div class="group-content prevent-click-event">
                         <div class="group-name prevent-click-event">${channel.name}</div>
                         <div class="group-last-message prevent-click-event">${channel._id.slice(-10)}</div>
                     </div>
                 </div>
                 `
             let templateChatGroup = `
                 <li>
                     <ul id="${channel}-chat" class="message-list hidden" id-channel-chats="test">
                     </ul>
                 </li>
                 `
             document.getElementById("sidebar").insertAdjacentHTML('beforeend', templateGroup);
             document.getElementById("chat-list").insertAdjacentHTML('beforeend', templateChatGroup);
         });
     }) */

}
const listItemGroup = document.querySelectorAll('.group');
const listChatGroup = document.querySelectorAll('.message-list');
if (listItemGroup.length > 0) {
    listItemGroup[0].classList.add('selected')
    listChatGroup[0].classList.remove('hidden')

}
listItemGroup.forEach((item, index) => {
    item.addEventListener('click', function () {
        listItemGroup.forEach((item, index) => {
            item.classList.remove('selected');
            listChatGroup[index].classList.add('hidden')
        });
        this.classList.add('selected');
        listChatGroup[index].classList.remove('hidden')
    });

});


//XU LI XOA TIN NHAN
socket.on('messageDeleted', (data) => {
    if (data.status == true) {
        const channelIndex = storageListMessage.findIndex((channel) => channel.channelId == data.receiverId)
        console.log("channel index:", channelIndex);
        const messageIndex = storageListMessage[channelIndex].messages.findIndex((msg) => msg._id == data._id)
        console.log("message Index:", messageIndex);
        if (messageIndex !== -1) {
            storageListMessage[channelIndex].messages.splice(messageIndex, 1);
            console.log("Deleted message id:", data._id);
        } else {
            console.log("Not found message id:", data._id);
        }

        document.getElementById(data._id).remove()
    } else {
        console.log("error deleted msg");
    }
})

const handleDeleteMsg = (id) => {
    console.log("id tin nhan:", id);

    const timeoutId = setTimeout(() => {
        socket.emit('deleteMessage', { messageId: id })

    }, 1);//chinh thoi gian sau bao nhieu milis se xoa

    document.getElementById(`cancelButton_${id}`).addEventListener('click', function () {
        clearTimeout(timeoutId);
        console.log('Cancel delete message');
    });

}




//XU LI THU HOI TIN NHAN
socket.on('messageRevoked', (data) => {
    if (data.status == true) {
        const channelIndex = storageListMessage.findIndex((channel) => channel.channelId == data.receiverId)
        console.log("channel index:", channelIndex);
        const messageIndex = storageListMessage[channelIndex].messages.findIndex((msg) => msg._id == data.channelId)
        console.log("message Index:", messageIndex);
        if (messageIndex !== -1) {
            storageListMessage[channelIndex].messages[messageIndex].messageContent = data.messageContent
            storageListMessage[channelIndex].messages[messageIndex].typeContent = data.typeContent
            storageListMessage[channelIndex].messages[messageIndex].updatedAt = data.updatedAt
            console.log("Revoked message id:", data.channelId);
        } else {
            console.log("Not found message id:", data.channelId);
        }
        const msg = storageListMessage[channelIndex].messages[messageIndex] //gan bien tu list danh tin nhan local
        const { _id, senderId, messageContent, updatedAt } = msg // spread msg tu trong local ra
        const parentElement = document.getElementById(data.channelId); //khai bao de lay cac thanh phan con
        parentElement.querySelector('.message-content p').textContent = `${messageContent}`
        parentElement.querySelector('.message-info').textContent = `${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}`
    } else {
        console.log("error revoked msg");
    }
})

const handleRevokeMsg = (id) => {
    console.log("id tin nhan:", id);

    //Nho kiem tra loai typeContent truoc khi thu hoi

    const timeoutId = setTimeout(() => {
        socket.emit('revokeMessage', { messageId: id })

    }, 1); //chinh thoi gian sau bao nhieu milis se thu hoi

    document.getElementById(`cancelButton_${id}`).addEventListener('click', function () {
        clearTimeout(timeoutId);
        console.log('Cancel revoke message');
    });

}



socket.on('getListDetailsChannels', (data) => {
    console.log("data hien thi ra ", data)
})
//TIN NHAN CU DUOC GUI O DAY
socket.on('getMessagesHistory', (data) => {
    console.log("tin nhan cu la ", data);
    /*  socket.on('lastMessage', (data) => {
         document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
         document.getElementById(`${data.channelId}-chat`).insertAdjacentHTML('beforeend', `<h1>${data.info}</h1>`);
     }) */

    //tim ra vi tri object noi luu danh sach tin nhan cu
    const foundElementIndex = storageListMessage.findIndex(elem => elem.channelId == data.channelId);
    if (foundElementIndex !== -1) {
        (storageListMessage[foundElementIndex].messages).unshift(...data.messages)
    }

    console.log(data);
    data.messages.map(message => {
        const { senderId, messageContent, receiverId, createdAt, updatedAt, _id } = message;

        const messageSenderElement = `<li class="message sender-message" id="${_id}">
                    <div class="message-avatar">
                        <img id="message-avatar-img" src="${senderId.avatar}">
                    </div>
                    <div class="message-content">
                        <p>${messageContent}</p>
                        <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                    </div>
                    <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                    <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                    <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
                </li>`
        const messageReceiverElement = `<li class="message receiver-message" id="${_id}">
                    <div class="message-avatar">
                        <img id="message-avatar-img" src="${senderId.avatar}">
                    </div>
                    <div class="message-content">
                        <p>${messageContent}</p>
                        <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                    </div>
                    <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                     <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                     <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
                </li>`


        if (senderId._id === sessionStorage.getItem('profileId')) {
            document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
            document.getElementById(`${data.channelId}-chat`).insertAdjacentHTML('beforeend', messageSenderElement);
        } else {
            document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
            document.getElementById(`${data.channelId}-chat`).insertAdjacentHTML('beforeend', messageReceiverElement);

        }
    })
})

//LANG NGHE SU KIEN KHI SCROLL LEN TREN CUNG DE TAI TIN NHAN CU NHAT
document.getElementById(`chat`).addEventListener('scroll', async () => {
    if (document.getElementById(`chat`).scrollTop === 0) {
        // Đã scroll đến đỉnh, gọi hàm load dữ liệu tiếp ở đây
        const channelId = await document.querySelector('.group.selected').id.split('-')[0]  // lay ra channel dang duoc focus vao
        const listMessages = await storageListMessage.find(elem => elem.channelId == channelId)
        console.log("channelId", channelId);
        console.log("tin nhan cu nhat scroll", listMessages.messages[0]);

        socket.emit('loadMessagesHistory', { senderId: sessionStorage.getItem('profileId'), oldMessageId: listMessages.messages[0]._id, receiverId: channelId })
    }
});

//TAI TIN NHAN LAN DAU KHI VAO APP
function getListMessage() {
    socket.on('getMessages', (data) => {
        storageListMessage.push(data) // dua data moi vao trong mang luu tru tin nhan 
        console.log("tin nhan duoc sap theo thu tu", data);

        data.messages.map(message => {
            const { senderId, messageContent, receiverId, createdAt, updatedAt, _id } = message;

            const messageSenderElement = `<li class="message sender-message" id="${_id}">
                    <div class="message-avatar">
                        <img id="message-avatar-img" src="${senderId.avatar}">
                    </div>
                    <div class="message-content">
                        <p>${messageContent}</p>
                        <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                    </div>
                    <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                     <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                     <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
                </li>`
            const messageReceiverElement = `<li class="message receiver-message" id="${_id}">
                    <div class="message-avatar">
                        <img id="message-avatar-img" src="${senderId.avatar}">
                    </div>
                    <div class="message-content">
                        <p>${messageContent}</p>
                        <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                    </div>
                    <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                     <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                     <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
                </li>`


            if (senderId._id === sessionStorage.getItem('profileId')) {
                document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
                document.getElementById(`${data.channelId}-chat`).insertAdjacentHTML('beforeend', messageSenderElement);
            } else {
                document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
                document.getElementById(`${data.channelId}-chat`).insertAdjacentHTML('beforeend', messageReceiverElement);

            }
        })
    })
}





// TAI TIN NHAN MOI VUA GUI TOI

function getMessage() {
    socket.on("getMessage", (data) => {
        const { senderId, messageContent, receiverId, createdAt, updatedAt, _id } = data;
        console.log("data get message: ", data);
        const messageSenderElement = `<li class="message sender-message" id="${_id}">
                <div class="message-avatar">
                    <img id="message-avatar-img" src="${senderId.avatar}">
                </div>
                <div class="message-content">
                    <p>${messageContent}</p>
                    <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                </div>
                <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                 <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                 <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
            </li>`
        const messageReceiverElement = `<li class="message receiver-message" id="${_id}">
                <div class="message-avatar">
                    <img id="message-avatar-img" src="${senderId.avatar}">
                </div>
                <div class="message-content">
                    <p>${messageContent}</p>
                    <div class="message-info">${senderId._id} / ${senderId.fullName} - ${new Date(updatedAt).toLocaleTimeString()}</div>
                </div>
                <button class="delete-message" onclick="handleDeleteMsg('${_id}')">Xóa</button>
                 <button class="cancel-message" id="cancelButton_${_id}">Hủy</button>
                 <button class="cancel-message" onclick="handleRevokeMsg('${_id}')">Thu hồi</button>
            </li>`

        console.log("tin nhan duoc gui la ", data);
        const foundElementIndex = storageListMessage.findIndex(elem => elem.channelId === data.receiverId);
        if (foundElementIndex !== -1) {
            storageListMessage[foundElementIndex].messages.push(data);
        }
        if (senderId._id === sessionStorage.getItem('profileId')) {
            document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
            document.getElementById(`${receiverId}-chat`).insertAdjacentHTML('beforeend', messageSenderElement);
        } else {
            document.getElementById(`chat`).scrollTop = document.getElementById(`chat`).scrollHeight
            document.getElementById(`${receiverId}-chat`).insertAdjacentHTML('beforeend', messageReceiverElement);

        }
    });

}

function scrollToBottom(receiverId) {
    const messageListScroll = document.getElementById(`${receiverId}-chat`)
    return messageListScroll.scrollTop = messageListScroll.scrollHeight;
}


//Xu li truong hop an enter de gui
const messageInput = document.getElementById("message-input");
messageInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
})

function sendMessage() {
    const messageContent = document.getElementById("message-input").value
    const senderId = sessionStorage.getItem('profileId'); // Thay thế bằng ID thực sự của người gửi
    const receiverId = document.querySelector('.group.selected').id.split('-')[0] //"65f421456957be1099c49d5f"; // Thay thế bằng ID thực sự của người nhận
    const typeContent = "text"; // Loại nội dung tin nhắn (có thể thay đổi tùy theo yêu cầu của bạn)
    // const _id = "1214"; // ID của tin nhắn (có thể thay đổi tùy theo yêu cầu của bạn)
    socket.emit("sendMessage", { senderId, receiverId, typeContent, messageContent });
    messageInput.value = ""; // Xóa nội dung trong ô nhập sau khi gửi tin nhắn
}

//Lang nghe su kien chon group de chat
//kiem tra so phong room hien co
function getStatusServer() {
    console.log("status cua danh sach phong trong server:");
    // socket.emit('test')
    // socket.emit('loadMessages', { senderId: sessionStorage.getItem('profileId') })
    // console.log("tin nhan trong storage la ", storageListMessage);
    socket.emit('test')
}
socket.on('getDetailsChannel', data => {
    console.log(data);
    const { _id } = data
    socket.emit('addChannel', { profileId: sessionStorage.getItem('profileId'), channelId: _id })
})
socket.on('createdChannel', (channel) => {
    console.log("id room duoc tao gui ve la ", channel);
    socket.emit('joinChannel', channel._id)
})

socket.on('errorSocket', error => {
    console.log("loi la: ", error);
})

function test() {
    console.log("test chuc nang socket:");

    socket.emit('createSingleChat', { typeChannel: 101, receiverId: '65f417a034e9a9f7e2f3cf9f' })
    // socket.emit('createGroupChat', { typeChannel: 202, name: 'Nhom con cac', members: ["65f417a034e9a9f7e2f3cf9f", "660aa562ad0cd7f7d5a2d8f2"]})
}