"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUrl = exports.deleteFromS3 = exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigned_url_1 = require("@aws-sdk/s3-request-presigned-url");
const config_1 = require("../utils/config");
const s3Client = new client_s3_1.S3Client({
    region: config_1.config.aws.region,
    credentials: {
        accessKeyId: config_1.config.aws.accessKeyId,
        secretAccessKey: config_1.config.aws.secretAccessKey,
    },
});
const uploadToS3 = async (fileBuffer, originalName, mimeType) => {
    const key = `documents/${Date.now()}-${originalName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: config_1.config.aws.s3Bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
    });
    await s3Client.send(command);
    return key;
};
exports.uploadToS3 = uploadToS3;
const deleteFromS3 = async (key) => {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: config_1.config.aws.s3Bucket,
        Key: key,
    });
    await s3Client.send(command);
};
exports.deleteFromS3 = deleteFromS3;
const generatePresignedUrl = async (key, filename) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: config_1.config.aws.s3Bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${filename}"`,
    });
    return (0, s3_request_presigned_url_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
};
exports.generatePresignedUrl = generatePresignedUrl;
//# sourceMappingURL=s3Service.js.map