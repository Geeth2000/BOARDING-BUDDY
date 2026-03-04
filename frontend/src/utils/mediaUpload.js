import { createClient } from "@supabase/supabase-js";

// Use environment variables for security
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(url, key);

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPG, JPEG, and PNG are allowed",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit",
    };
  }

  return { valid: true };
};

/**
 * Upload a single file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} bucket - Bucket name (default: "property-images")
 * @param {string} folder - Optional folder path
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadFile = async (
  file,
  bucket = "property-images",
  folder = "",
) => {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create unique file name
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const fileName = folder
    ? `${folder}/${timestamp}-${sanitizedFileName}`
    : `${timestamp}-${sanitizedFileName}`;

  // Upload to Supabase
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload file");
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};

/**
 * Upload multiple files to Supabase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} bucket - Bucket name
 * @param {string} folder - Optional folder path
 * @param {Function} onProgress - Progress callback (index, total)
 * @returns {Promise<string[]>} - Array of public URLs
 */
export const uploadMultipleFiles = async (
  files,
  bucket = "property-images",
  folder = "",
  onProgress,
) => {
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate each file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(`File "${file.name}": ${validation.error}`);
    }

    // Update progress
    if (onProgress) {
      onProgress(i + 1, files.length);
    }

    // Upload file
    const url = await uploadFile(file, bucket, folder);
    urls.push(url);
  }

  return urls;
};

/**
 * Delete a file from Supabase Storage
 * @param {string} fileUrl - Public URL of the file
 * @param {string} bucket - Bucket name
 */
export const deleteFile = async (fileUrl, bucket = "property-images") => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split(`/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];
    await supabase.storage.from(bucket).remove([filePath]);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Create a preview URL for a file (for local preview before upload)
 * @param {File} file - File to preview
 * @returns {string} - Object URL for preview
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a preview URL to free memory
 * @param {string} url - Preview URL to revoke
 */
export const revokePreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};

// Default export for backward compatibility
export default uploadFile;
