const User = require('../models/user');
const Roles = require('../utils/roles.json');
const { superAdmin: { login, password } } = require('./config');

module.exports = async () => {
    if (!login && !password) {
        return;
    }

    let user = await User.findOne({ login }).lean();

    if (!user) {
        const newUser = new User({
            login,
            password,
            name: 'Super Admin',
            email: 'superAdmin@email.com',
            course: ['Other'],
            roles: [Roles.SUPER_ADMIN],
        });

        user = await newUser.save();
        console.log('Super admin has been created');
    }
};
