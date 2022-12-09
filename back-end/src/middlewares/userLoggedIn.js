const tokenUtils = require('../utils/tokenUtils');
const permissionUtils = require('../utils/permissionUtils');
const Roles = require('../utils/roles.json');

function isRoleAssignedToLoggedInUser(roles, req, res, next) {
    try {
        const userRoles = req.userData.roles || [];

        const isUserWithSomeRoleRequired = roles.some((role) => userRoles.includes(role));

        if (!isUserWithSomeRoleRequired) {
            throw new Error();
        }

        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Usuário não possui permissão para acessar o recurso',
        });
    }
}

exports.validateLoggedIn = function validate(req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const userDecoded = tokenUtils.verify(token);
        const userRoles = userDecoded.roles || [];

        // When the user is not a coordinator then we need to assign to course the
        // first value from the array
        if (!userRoles.includes(Roles.COORDINATOR)) {
            [userDecoded.course] = userDecoded.course;
        }

        userDecoded.iat = undefined;

        req.userData = userDecoded;

        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Falha na autenticação!',
        });
    }
};

exports.isStudent = function validate(req, res, next) {
    return isRoleAssignedToLoggedInUser([Roles.STUDENT], req, res, next);
};

exports.isSuperAdmin = function validate(req, res, next) {
    return isRoleAssignedToLoggedInUser([Roles.SUPER_ADMIN], req, res, next);
};

exports.isCoordinator = function validate(req, res, next) {
    return isRoleAssignedToLoggedInUser([Roles.COORDINATOR], req, res, next);
};

exports.isCoordinatorOrSuperAdmin = function validate(req, res, next) {
    return isRoleAssignedToLoggedInUser([Roles.SUPER_ADMIN, Roles.COORDINATOR], req, res, next);
};

exports.validateOwnResourceAccess = function validate(req, res, next) {
    const userRoles = req.userData.roles || [];
    const resourceOwnerId = req.params.coordinatorId;

    if (userRoles.includes(Roles.SUPER_ADMIN)) {
        return next();
    }

    if (permissionUtils.isResourceOwner(req.userData.id, resourceOwnerId)) {
        return next();
    }

    return res.status(401).json({
        message: 'Usuário não possui permissão para acessar o recurso',
    });
};
