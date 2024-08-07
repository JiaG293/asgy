const { uploadDocumentChat, uploadVideoChat, uploadImageChat } = require("../services/s3.service");

exports.uploadMiddleware = (req, res, next) => {
    const { typeContent } = req.params;

    switch (typeContent) {
        case 'image':
            return uploadImageChat.array('image', 30)(req, res, next);
        case 'video':
            return uploadVideoChat.array('video', 10)(req, res, next);
        case 'document':
            return uploadDocumentChat.array('document', 30)(req, res, next);
        default:
            return res.status(401).json({
                error: {
                    status: 401,
                    message: 'Invalid type content'
                }
            });
    }
}