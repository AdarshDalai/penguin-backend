const storageService = require('../services/storage.service');
const { successResponse, errorResponse } = require('../schemas/response/auth.response.schema');
const { HTTP_STATUS } = require('../core/constants/http.constants');

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

/**
 * Handle multipart/form-data file upload to Supabase storage bucket.
 */
async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('No file provided in form-data payload. Key name must be "file"'));
    }

    const token = extractToken(req);
    const bucketName = req.body.bucket || req.body.bucket_name;
    const customPath = req.body.path;

    const { data, error } = await storageService.uploadFile({
      file: req.file,
      bucketName,
      customPath,
      token,
    });

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse(error.message || 'Failed to upload file to storage'));
    }

    return res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse('File uploaded successfully', data));
  } catch (err) {
    next(err);
  }
}

/**
 * Generate presigned URL for a stored file URL / path.
 */
async function presignUrl(req, res, next) {
  try {
    const fileUrl = req.body.file_url || req.query.file_url;
    if (!fileUrl) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('file_url is required'));
    }

    const token = extractToken(req);
    const bucketName = req.body.bucket || req.body.bucket_name || req.query.bucket;
    const expiresIn = parseInt(req.body.expires_in || req.query.expires_in || 3600, 10);

    const { data, error } = await storageService.generatePresignedUrl({
      fileUrl,
      bucketName,
      expiresIn,
      token,
    });

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse(error.message || 'Failed to generate presigned URL'));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Presigned URL generated successfully', data));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadFile,
  presignUrl,
};
