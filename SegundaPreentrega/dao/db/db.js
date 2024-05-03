const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../../winston-config');

const connectionString = 'mongodb+srv://deikerv:deiker123456@ecommerce.x7pvxzk.mongodb.net/Ecommerce';

const connectDB = async () => {
try {
await mongoose.connect(config.mongoURI);
logger.debug('MongoDB Connected...');
} catch (err) {
console.error('Connection to MongoDB failed', err.message);
process.exit(1);
}
};

module.exports = connectDB;
