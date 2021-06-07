const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "your_secret",
  jwtExpiry: process.env.JWT_EXPIRY || 15,
  refresnExpiry: process.env.REFRESH_TOKEN_EXPIRES || 60 * 24 * 30,
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mern-basics-db",
};

export default config;
