const { verifyJWT } = require("../auth/authUtils");
const { findTokenById } = require("../services/keyToken.service");


const authenticationSocket = async (socket, next) => {
    //Lay headers tu client
    const clientId = socket.handshake?.headers['x-client-id'];
    const authorization = socket.handshake?.headers['authorization'];
    try {
        if (clientId == 'undefined' || authorization == 'undefined') {
            throw new Error('x-client-id and authorization provided')
        }
        const keyStore = await findTokenById(clientId);
        if (!keyStore) {
            throw new Error('Not found key store')
        }

        const decodeUser = await verifyJWT(authorization, keyStore.privateKey);
        if (clientId !== decodeUser.clientId) {
            throw new Error('Invalid UserId')
        }
        //gan thong tin da xac thuc cho auth
        socket.auth = decodeUser;

    } catch (error) {
        return next(error)
    }
    return next()
};

module.exports = authenticationSocket