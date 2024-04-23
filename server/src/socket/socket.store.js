
global._profileConnected = new Map();

/* 
FORM:

["profileId":
    {
        socketIds: ["socket.id", "socket.id"],
        channels: ["channelId", "channelId"]
    }
]
 */


//THEM PROFILEID VAO _PROFILECONNECTED 
const addProfileConnected = async ({ profileId, channels }, socket) => {
    try {
        if (_profileConnected.has(profileId)) {
            const profile = _profileConnected.get(profileId);
            if (profile.socketIds.length === 0) {
                profile.socketIds.push(socket.id);
            } else {
                if (!profile.socketIds.includes(socket.id)) {
                    profile.socketIds.push(socket.id);
                }
            }
            channels.forEach(channelId => {
                socket.join(String(channelId));
            });
        } else {
            _profileConnected.set(profileId, {
                socketIds: [socket.id],
                channels: channels.map(channel => String(channel))
            });
            channels.forEach(channelId => {
                socket.join(String(channelId));
            });
        }
    } catch (error) {
        console.error('Error addProfileConnected:', error);
        socket.emit('errorSocket', { message: 'add profileConnected id not exist', status: 404 });
    }
};


//XOA SOCKET.ID KHI CLIENT DISCONNECTED 
const removeProfileConnect = async (profileId, socket) => {
    const check = _profileConnected.has(profileId);
    if (check) {

        //Xoa socket.id neu disconected
        const indexSocket = _profileConnected.get(profileId).socketIds.findIndex(elem => elem == socket.id)
        if (indexSocket !== -1) {
            _profileConnected.get(profileId).socketIds.splice(indexSocket, 1)
        }

        //Neu khoong co socket.id nao ton tai trong do thi se xoa luon profileId 
        if (_profileConnected.get(profileId).socketIds.length == 0) {
            _profileConnected.delete(profileId)
        }

    } else {
        socket.emit('errorSocket', { message: 'profile id not exist', status: 404 })
        console.log(`\n\nError removeProfileConnect: profile id not exist`);
    }
};

const emitProfileId = ({ profileId, params, data }, io) => {
    if (_profileConnected.get(String(profileId))) {
        _profileConnected.get(String(profileId)).socketIds.forEach(socket => io.to(socket).emit(params, data))
    } else {
        // socket.emit('errorSocket', { message: 'profile id is not exist', status: 500 })
        console.log(`\n\n emitProfileId: profile id is not exist`);
    }
};


const addNewChannel = async (channelId, socket) => {
    const profileId = socket.auth.profileId;

    if (_profileConnected.has(profileId)) {
        const profile = _profileConnected.get(profileId);

        if (!profile.channels.includes(String(channelId))) {
            profile.channels.push(String(channelId));

            // Thêm socket vào kênh mới và gửi sự kiện 'createdChannel' đến socket đó
            socket.join(String(channelId));
            socket.emit('createdChannel', channelId);
        } else {
            socket.emit('errorSocket', { message: 'Channel ID already exists', status: 409 });
        }
    }
};

/* const removeChannel = async (channelId, socket) => {
    const profileId = socket.auth.profileId;

    if (_profileConnected.has(profileId)) {
        const profile = _profileConnected.get(profileId);

        if (profile.channels.includes(String(channelId))) {
            const index = profile.channels.indexOf(String(channelId));
            profile.channels.splice(index, 1);

            const sockets = profile.socketIds.map(socketId => io.sockets.connected[socketId]);
            sockets.forEach(socket => {
                socket.leave(String(channelId));
                socket.emit('leaveChannel', channelId);
            });

        } else {
            socket.emit('errorSocket', { message: 'Channel ID does not exist in profile', status: 404 });
        }
    }
}; */

const removeChannel = async (channelId, profileId) => {
    const profileSocket = _profileConnected.get(profileId)
    console.log(`\nPROFILEID: ${profileId} \n\nSocket id cua:\n ${profileSocket?.socketIds} \n\n Channels: \n${profileSocket?.channels} `);
    if (profileSocket?.socketIds) {
        profileSocket.socketIds.forEach(socketId => {

            const index = profileSocket.channels.indexOf(channelId);
            if (index !== -1) {
                profileSocket.channels.splice(index, 1);
                console.log(`Removed channel of profileId ${profileId}`);
            }

            const socket = _io.sockets.sockets.get(socketId);

            if (socket) {
                console.log(`Forcing user ${socket.id} to leave room ${channelId}`);
                socket.leave(channelId);
                console.log("\n2. List Online:::", _profileConnected)
                console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids)
            } else {
                console.log(`Socket with socketId ${socket.id} not found.`);
            }
        });
        return true
    } else {
        console.log(`Socket with profileId ${profileId} not found`)
        return false
    }




}




module.exports = {
    addProfileConnected,
    removeProfileConnect,
    removeChannel,
    addNewChannel,
    emitProfileId,

}
