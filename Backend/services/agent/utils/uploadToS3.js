import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3 from "../config/s3"

export const uplodToS3 = async (filename, buffer, contentType) => {
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Body: buffer,
            Key: filename,
            ContentType: contentType
        })
    )
    return filename
}