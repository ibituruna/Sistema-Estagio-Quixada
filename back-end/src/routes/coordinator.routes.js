const express = require('express');
const coordinatorController = require('../controllers/coordinator');
const {
    validateLoggedIn, validateOwnResourceAccess, isSuperAdmin, isCoordinatorOrSuperAdmin,
} = require('../middlewares/userLoggedIn');

const router = express.Router();

router.get('/', validateLoggedIn, isSuperAdmin, coordinatorController.getAllCoordinators);
router.get('/:coordinatorId', validateLoggedIn, isSuperAdmin, coordinatorController.getCoordinator);
router.post('/', validateLoggedIn, isSuperAdmin, coordinatorController.registerNewCoordinator);
router.patch('/:coordinatorId', validateLoggedIn, isCoordinatorOrSuperAdmin, validateOwnResourceAccess, coordinatorController.updateCoordinator);
router.delete('/:coordinatorId', validateLoggedIn, isSuperAdmin, coordinatorController.deleteCoordinator);

module.exports = router;
