import AWS from "aws-sdk"
import dotenv from 'dotenv';

dotenv.config();
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_DEFAULT_REGION,
});


const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;


export const listS3Objects = async (username) => {
    const params = {
        Bucket: bucketName,
        Prefix: username+'/'
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents;
    } catch (err) {
        throw err;
    }
};

export const uploadFileToS3 = async (file) => {
    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file.data,
    };

    try {
        const data = await s3.putObject(params).promise();
        return data.Contents;
    } catch (err) {
        throw err;
    }
};

export const generatePresignedUrl = async (fileName) => {
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 43200,
    };

    try {
        const url = await s3.getSignedUrlPromise("getObject", params);
        return url;
    } catch (err) {
        throw err;
    }
};

export const deleteFileFromS3 = async (fileName) => {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    try {
        const data = await s3.deleteObject(params).promise();
        return data;
    } catch (err) {
        throw err;
    }
};

// export const downloadFileFromS3 = (fileName) => {
// 	const params = {
// 		Bucket: bucketName,
// 		Key: fileName,
// 	};
// 	try {
// 		s3.getObject(params, (err, data) => {
// 			resolve(data.Body);
// 		});
// 	} catch (err) {
// 		return err;
// 	}
// };
