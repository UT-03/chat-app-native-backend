const Message = require('../models/Message');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');

const checkContacts = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        const userId = req.userData.userId;
        const { phoneNumbers } = req.body;

        let contacts = await User.find({ phoneNumber: { $in: phoneNumbers }, _id: { $ne: userId } }).select('phoneNumber');

        res.json({
            contacts: contacts
        });
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
}

const getMessages = async (req, res, next) => {
    const userId = req.params.userId;
    const senderId = req.userData.userId;

    const messages = await Message.find({
        users: {
            $all: [userId, senderId],
        },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map(msg => {
        return {
            text: msg.text,
            fromSelf: msg.sender.toString() === senderId.toString()
        }
    });

    res.json({ messages: projectedMessages });
}

const sendMessage = async (req, res, next) => {
    try {
        const senderId = req.userData.userId;

        // Extracting req body
        const { text, to } = req.body;

        // Creating new message
        const newMessage = new Message({
            text: text,
            users: [senderId, to],
            sender: senderId
        })

        await newMessage.save();

        res.json({ message: "sent" })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
}

module.exports = {
    checkContacts,
    getMessages,
    sendMessage
}