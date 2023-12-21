const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

export { mongoUri, jwtSecret };