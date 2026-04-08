import { v2 as cloudinary } from 'cloudinary';

// Prevent crash if env vars are missing
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

if (cloudName) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
} else {
    console.warn("Cloudinary not configured: Missing CLOUDINARY_CLOUD_NAME");
}

export default cloudinary;
