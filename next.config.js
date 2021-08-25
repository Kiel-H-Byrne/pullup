require("dotenv").config();

module.exports = {
  env: {
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    WEB_URI: process.env.WEB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
