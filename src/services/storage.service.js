const { supabase, createScopedClient } = require('../core/config/supabase');
const { SUPABASE_STORAGE_BUCKET } = require('../core/config/env');
const path = require('path');

/**
 * Uploads a file buffer to Supabase Storage.
 */
async function uploadFile({ file, bucketName, customPath, token }) {
  const bucket = bucketName || SUPABASE_STORAGE_BUCKET;
  const client = token ? createScopedClient(token) : supabase;

  // Generate unique file path if customPath not provided
  let filePath = customPath;
  if (!filePath) {
    const fileExt = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizeName = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    filePath = `uploads/${timestamp}_${randomStr}_${sanitizeName}${fileExt}`;
  }

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    return { data: null, error };
  }

  // Generate public URL or file path reference
  const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);

  return {
    data: {
      path: data.path,
      bucket: bucket,
      file_url: publicUrlData?.publicUrl || data.path,
    },
    error: null,
  };
}

/**
 * Parses file_url or storage path to extract bucket and object path, then creates a presigned URL.
 */
async function generatePresignedUrl({ fileUrl, bucketName, expiresIn = 3600, token }) {
  const client = token ? createScopedClient(token) : supabase;

  let bucket = bucketName || SUPABASE_STORAGE_BUCKET;
  let objectPath = fileUrl;

  // If full Supabase URL is passed, parse the object path and bucket
  if (fileUrl.includes('/storage/v1/object/')) {
    try {
      const urlObj = new URL(fileUrl);
      const pathnameParts = urlObj.pathname.split('/storage/v1/object/');
      if (pathnameParts.length > 1) {
        const fullStoragePath = decodeURIComponent(pathnameParts[1]);
        const slashIndex = fullStoragePath.indexOf('/');
        if (slashIndex !== -1) {
          const publicOrSign = fullStoragePath.substring(0, slashIndex);
          const rest = fullStoragePath.substring(slashIndex + 1);
          if (publicOrSign === 'public' || publicOrSign === 'authenticated' || publicOrSign === 'sign') {
            const nextSlashIndex = rest.indexOf('/');
            if (nextSlashIndex !== -1) {
              bucket = rest.substring(0, nextSlashIndex);
              objectPath = rest.substring(nextSlashIndex + 1);
            } else {
              objectPath = rest;
            }
          } else {
            bucket = publicOrSign;
            objectPath = rest;
          }
        }
      }
    } catch (e) {
      // Fallback if URL parsing fails
    }
  }

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error) {
    return { data: null, error };
  }

  return {
    data: {
      signed_url: data.signedUrl,
      expires_in: expiresIn,
      path: objectPath,
      bucket: bucket,
    },
    error: null,
  };
}

module.exports = {
  uploadFile,
  generatePresignedUrl,
};
