const jwt = require('jsonwebtoken');
const { privateKey } = require('../config/config').token;

function verify(token) {
    return jwt.verify(token, privateKey);
}

function generateAuthToken(userId, userName, userEmail, userLogin, userCourse, userRoles) {
    return jwt.sign({
        id: userId,
        name: userName,
        email: userEmail,
        login: userLogin,
        course: userCourse,
        roles: userRoles,
    }, privateKey);
}

module.exports = {
    verify,
    generateAuthToken,
};
