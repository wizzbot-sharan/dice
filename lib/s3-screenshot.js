const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

let s3Client = null;

function hasAwsS3Config() {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET_NAME } = process.env;
  return Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_REGION && AWS_S3_BUCKET_NAME);
}

function getS3Client() {
  if (!hasAwsS3Config()) return null;
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
  }
  return s3Client;
}

/**
 * Uploads a screenshot to S3.
 * @param {Buffer} buffer The PNG buffer.
 * @param {string} awlId e.g. AWL-1234
 * @param {string} company Job company name
 * @param {string} title Job title
 * @returns {Promise<string|null>} The public S3 URL, or null if missing config/failed
 */
async function uploadScreenshot(buffer, awlId, company, title) {
  if (!hasAwsS3Config()) {
    console.log('[s3-screenshot] AWS S3 config missing, skipping screenshot upload.');
    return null;
  }

  const client = getS3Client();
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const basePath = process.env.AWS_S3_BASE_PATH || 'dice-applications/screenshots';

  const safeAwlId = (awlId || 'unknown').replace(/[\/\\|]/g, '-');
  const safeCompany = (company || 'unknown').replace(/[\/\\|]/g, '-');
  const safeTitle = (title || 'unknown').replace(/[\/\\|]/g, '-');

  const fileName = `${safeAwlId}|${safeCompany}|${safeTitle}.png`;
  const key = `${basePath}/${safeAwlId}/${fileName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      // If the bucket does not support ACLs, ACL: 'public-read' might fail.
      // Depending on bucket config, it's safer not to send ACLs unless required, 
      // but to return the standard format URL. 
    });

    await client.send(command);
    console.log(`[s3-screenshot] Uploaded successfully to: s3://${bucketName}/${key}`);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error(`[s3-screenshot] Upload failed for ${key}:`, error);
    return null; // Return null so we don't crash the apply process
  }
}

module.exports = {
  hasAwsS3Config,
  uploadScreenshot
};
