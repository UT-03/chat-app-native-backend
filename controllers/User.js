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

module.exports = {
    checkContacts
}