const AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
	region: process.env.REACT_APP_AWS_DEFAULT_REGION,
});

const s3 = new AWS.S3();

export const listS3Objects = (bucketName) => {
	const params = {
		Bucket: bucketName,
	};

	return new Promise((resolve, reject) => {
		s3.listObjectsV2(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data.Contents);
			}
		});
	});
};

export const uploadFileToS3 = (bucketName, file) => {
	const params = {
		Bucket: bucketName,
		Key: file.name,
		Body: file,
	};

	return new Promise((resolve, reject) => {
		s3.upload(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

export const generatePresignedUrl = (bucketName, fileName) => {
	const params = {
	  Bucket: bucketName,
	  Key: fileName,
	  Expires: 43200,
	};

	return new Promise((resolve, reject) => {
	  s3.getSignedUrl('getObject', params, (err, url) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(url);
		}
	  });
	});
  };


export const deleteFileFromS3 = (bucketName, name) => {
	const params = {
		Bucket: bucketName,
		Key: name,
	};

	return new Promise((resolve, reject) => {
		s3.deleteObject(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

export const downloadFileFromS3 = (bucketName, fileName) => {
	const params = {
		Bucket: bucketName,
		Key: fileName,
	};

	return new Promise((resolve, reject) => {
		s3.getObject(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data.Body);
			}
		});
	});
};
