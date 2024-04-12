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

const fileFilterImage = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    return cb("Error: Please upload jpeg | jpg | png | gif");
}
const fileFilterVideo = (req, file, cb) => {
    const fileTypes = /mp4|webm/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    return cb("Error: Please upload mp4 | webm ");
}

const fileFilterDocument = (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|pptx|ppt|xls|xlsx|csv|epub|mobi|txt|bat/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    return cb("Error: Please upload pdf | doc | docx | pptx | ppt | xls | xlsx | csv | epub | mobi | txt | bat ");
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
            cb(null, "chats/document/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilterDocument
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
            cb(null, "chats/video/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilterVideo
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
            cb(null, "chats/image/" + file.fieldname + '_' + uniqueSuffix + file.originalname)
        }
    }),
    limits: {
        fieldSize: 1024 * 1024 * 1024 * 100
    },
    fileFilter: fileFilterImage
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