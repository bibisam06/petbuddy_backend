import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from "path";

//models
import Pet from '../models/pet.model.js';

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
    acl: "public-read",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: async function (req, file, cb) {
      try {
        const dogId = req.body.pet_id;
        console.log(dogId);
      const dogData = await Pet.findOne({
        where: { pet_id: req.body.pet_id },
    });

      console.log(dogData);

        const userId = dogData.user_id;
        const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
        const timestamp = Date.now();
        const ext = path.extname(file.originalname); // 파일 확장자 유지 (.jpg, .png 등)

        const filename = `user_${userId}/dog_${dogId}/${today}/photo_${timestamp}${ext}`;
        cb(null, filename);
      } catch (err) {
        console.error(err.message);
        cb(err);
      }
    },
  }),
});



export default upload;