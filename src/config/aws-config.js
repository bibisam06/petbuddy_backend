import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
dotenv.config();

const key = { //key 설정 
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
};

AWS.config.update(key);

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', 
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        //fine Name 
        const filename = `uploads/${Date.now().toString()}_${file.originalname}`;
        cb(null, filename);
    },
    }),
});


export default upload;