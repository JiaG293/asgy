
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class SocketController {

    //connected chat
    message = async (req, res, next) => {
        const { msg } = req.query;
        _io.emit('chat message', msg)
        return res.json({code: 200, message: msg});
    }


}


module.exports = new SocketController()