import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const getFromS3 = async (key) => {
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    })
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    })
    const response = await s3.send(command)
    return response.Body.toString("utf-8")
}