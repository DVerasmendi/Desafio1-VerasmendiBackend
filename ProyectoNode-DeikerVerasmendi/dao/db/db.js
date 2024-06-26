const mongoose = require('mongoose');
const logger = require('../../configuration/winston-config');
require('dotenv').config();

const env = process.env.NODE_ENV || 'production';
const connectionString = env === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

//console.log(`Environment: ${env}`);
//console.log(`MongoDB connection string: ${connectionString}`);

const connectDB = async () => {
try {
if (!connectionString) {
    throw new Error('MongoDB connection string is not defined');
}
await mongoose.connect(connectionString);
//logger.debug(`MongoDB Connected to ${connectionString}... Environment: ${env}`);
} catch (err) {
console.error('Connection to MongoDB failed', err.message);
process.exit(1);
}
};

module.exports = connectDB;
