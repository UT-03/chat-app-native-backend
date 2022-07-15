const mongoose = require('mongoose');

const activeUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User', unique: true },
    socketId: { type: String, required: true }
});

module.exports = mongoose.model('Active User', activeUserSchema);