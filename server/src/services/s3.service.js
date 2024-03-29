const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config()
const { AWS_IAM_USER_KEY, AWS_IAM_USER_SECRET, AWS_BUCKET_NAME, AWS_BUCKET_REGION } = process.env

const s3Config = new aws.S3({
    accessKeyId: AWS_IAM_USER_KEY,
    secretAccessKey: AWS_IAM_USER_SECRET,
    region: AWS_BUCKET_REGION,
    Bucket: AWS_BUCKET_NAME,
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    return cb("Error: Please upload jpeg | jpg | png | gif");
}


const uploadDocumentChat = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalname: file.originalname,
            })
        },
        key: (req, file, cb) => {
            /*  
            
                file duoc luu vao duong dan "/profile" co dinh dang ten la :
                <key>_<Date.Now()>-<Random 1 ty>_<File name original> 
            
             */
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, "chats/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});

const uploadVideoChat = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalname: file.originalname,
            })
        },
        key: (req, file, cb) => {
            /*  
            
                file duoc luu vao duong dan "/profile" co dinh dang ten la :
                <key>_<Date.Now()>-<Random 1 ty>_<File name original> 
            
             */
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, "chats/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});


const uploadImageChat = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalname: file.originalname,
            })
        },
        key: (req, file, cb) => {
            /*  
            
                file duoc luu vao duong dan "/profile" co dinh dang ten la :
                <key>_<Date.Now()>-<Random 1 ty>_<File name original> 
            
             */
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, "chats/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});


const uploadAvatar = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalname: file.originalname,
            })
        },
        key: (req, file, cb) => {
            /*  
            
                file duoc luu vao duong dan "/profile" co dinh dang ten la :
                <key>_<Date.Now()>-<Random 1 ty>_<File name original> 
            
             */
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, "profile/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});


/* const messageS3Config = multerS3({
    s3: s3Config,
    bucket: AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, "messages/" + file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname))
    }
});
 */

/* exports.uploadMessage = multer({
    storage: messageS3Config,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}); */

const deleteFileS3 = async (fileuri) => {
    const fileKey = fileuri.split('/').slice(-2).join("/");
    return await s3Config.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: fileKey
    }).promise();
}

module.exports = {
    deleteFileS3,
    uploadAvatar,
    uploadImageChat,
    uploadVideoChat,
    uploadDocumentChat,

}