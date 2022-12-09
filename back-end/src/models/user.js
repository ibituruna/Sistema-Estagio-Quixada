const bcrypt = require('bcryptjs');
const { Schema, Types, model } = require('mongoose');
const { superAdmin } = require('../config/config');
const Roles = require('../utils/roles.json');
const tokenUtils = require('../utils/tokenUtils');
const externalProfileUtils = require('../externals/externalProfile');

const userSchema = new Schema({
    name: { type: String, maxlength: 50, required: true },
    login: { type: String, maxlength: 50, required: true },
    email: { type: String, maxlength: 50, required: true },
    password: { type: String },
    course: { type: [String], required: true },
    roles: { type: [String], required: true },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
    const user = this;

    // eslint-disable-next-line object-curly-newline
    const { name, email, login, course, roles } = user;

    // eslint-disable-next-line no-underscore-dangle
    const token = tokenUtils.generateAuthToken(user._id, name, email, login, course, roles);

    return token;
};

userSchema.methods.getPojoSchema = function getPojoSchema() {
    const user = this.toObject();

    // eslint-disable-next-line no-underscore-dangle
    user.id = user._id;

    ['password', 'createdAt', 'updatedAt', '__v', '_id'].forEach((attribute) => {
        user[attribute] = undefined;
    });

    if (!user.roles.includes(Roles.COORDINATOR)) {
        [user.course] = user.course;
    }

    return user;
};

userSchema.statics.findByCredentials = async function findByCredentials(login, password) {
    const user = await this.findOne({ login });

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            return user;
        }
    }

    return null;
};

userSchema.statics.findCoordinatorByCourse = async function findCoordinatorByCourse({ course }) {
    const match = {
        $match: {
            roles: Roles.COORDINATOR,
            course,
        },
    };

    const coordinators = await this.aggregate([
        match,
        {
            $replaceRoot: {
                newRoot: {
                    id: '$_id', name: '$name', login: '$login', email: '$email', course: '$course', roles: '$roles',
                },
            },
        },
    ]);

    return coordinators && coordinators.length ? coordinators[0] : null;
};

userSchema.statics.findCoordinators = async function find({ coordinatorId, login, course }) {
    const match = {
        $match: {
            roles: Roles.COORDINATOR,
            _id: Types.ObjectId(coordinatorId),
            login,
            course,
        },
    };

    if (!coordinatorId) {
        // eslint-disable-next-line no-underscore-dangle
        delete match.$match._id;
    }

    if (!login) {
        delete match.$match.login;
    }

    if (!course) {
        delete match.$match.course;
    }

    const coordinators = await this.aggregate([
        match,
        {
            $replaceRoot: {
                newRoot: {
                    id: '$_id', name: '$name', login: '$login', email: '$email', course: '$course', roles: '$roles',
                },
            },
        },
    ]);

    return coordinatorId || login || course ? coordinators[0] : coordinators;
};

userSchema.statics.isLoginAlreadyInUse = async function isLoginAlreadyInUse(login) {
    const user = await this.findOne({ login });

    return !!user;
};

userSchema.statics.authenticateExternalUser = async function authenticate(login, password) {
    const externalProfileData = await externalProfileUtils.getExternalProfileData(login, password);

    if (!externalProfileData.success) {
        return externalProfileData;
    }

    let user = await this.findOne({ login });

    if (!user) {
        // eslint-disable-next-line object-curly-newline
        const { name, email, course, roles } = externalProfileData;
        const newUser = new this({
            name,
            login,
            email,
            course,
            roles,
        });

        user = await newUser.save();
    }

    return {
        success: true,
        user,
    };
};

userSchema.statics.isSuperAdmin = function isSuperAdmin(login) {
    return superAdmin && superAdmin.login === login;
};

userSchema.statics.isCoordinator = async function isCoordinator(login) {
    return !!await this.findCoordinators({ login });
};

userSchema.statics.authenticateSuperAdminUser = async function authenticate(login, password) {
    if (!this.isSuperAdmin(login)) {
        return {
            success: false,
            isAccessDenied: true,
        };
    }

    return this.authenticateInternalUser(login, password);
};

userSchema.statics.authenticateInternalUser = async function authenticate(login, password) {
    const user = await this.findByCredentials(login, password);

    if (!user) {
        return {
            success: false,
            isAccessDenied: true,
        };
    }

    return {
        success: true,
        user,
    };
};

userSchema.statics.authenticateUser = async function authenticate(login, password) {
    if (this.isSuperAdmin(login)) {
        return this.authenticateSuperAdminUser(login, password);
    }

    const isCoordinator = await this.isCoordinator(login);

    if (isCoordinator) {
        return this.authenticateInternalUser(login, password);
    }

    return this.authenticateExternalUser(login, password);
};

const User = model('User', userSchema);

module.exports = User;
