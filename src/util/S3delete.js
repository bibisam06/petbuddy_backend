import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { NoDogError } from '../error/error.handler.js';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

dotenv.config();

/**
 * S3의 특정 폴더(접두사, prefix) 아래 모든 파일 삭제
 * @param {string} prefix - 예: 'user_1/dog_2/2025-07-22/'
 */

export const deleteS3Folder = async (prefix) => {
  try {
  
    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
      console.log('🟡 삭제할 파일이 없습니다');
      throw new NoDogError("해당 강아지에게 삭제할 똥 사진이 없습니다");
    }

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    };

    await s3.deleteObjects(deleteParams).promise();
    console.log(`✅ 폴더 dog_${prefix} 아래 파일 삭제 완료`);
  } catch (error) {
    console.error(`❌ S3 폴더 삭제 실패: ${error.message}`);
    throw error;
  }
};
