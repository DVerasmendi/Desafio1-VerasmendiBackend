const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true },
    mimetype: { type: String, required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true } 
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    documents: [documentSchema],
    last_connection: { type: Date }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
