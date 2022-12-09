exports.isResourceOwner = function isResourceOwner(currentUserId, resourceOwnerId) {
    if (!currentUserId || !resourceOwnerId) {
        return false;
    }

    return currentUserId === resourceOwnerId.toString();
};
