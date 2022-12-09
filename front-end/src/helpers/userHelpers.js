import store from '@/store';

function getUserRoles() {
    let userRoles = store.getters['authentication/roles'];

    if (!Array.isArray(userRoles)) {
        userRoles = [userRoles];
    }

    if (!userRoles || !userRoles.length) {
        if (localStorage.getItem('roles')) {
            userRoles = [localStorage.getItem('roles')];
        }
    }

    return userRoles;
}

function isAccessAuthorized (routeRoles) {
    const userRoles = getUserRoles();

    if (!routeRoles || !routeRoles.length) {
        return true;
    }

    return routeRoles.some(function (role) {
        return userRoles.includes(role);
    });
}

function isUserRoleSet() {
    const userRoles = getUserRoles();

    return userRoles && userRoles.length > 0;
}

export { 
    isAccessAuthorized,
    isUserRoleSet,
    getUserRoles,
};
