const User = require('../models/user');
const Roles = require('../utils/roles.json');
const permissionUtils = require('../utils/permissionUtils');
const config = require('../config/config');

// eslint-disable-next-line no-unused-vars
function generatePassword() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';

    for (let i = 0; i <= passwordLength; i += 1) {
        const randomNumber = Math.floor(Math.random() * chars.length);

        password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
}

exports.registerNewCoordinator = async function registerNewCoordinator(req, res) {
    try {
        const isLoginAlreadyInUse = await User.isLoginAlreadyInUse(req.body.login);

        if (isLoginAlreadyInUse) {
            return res.status(409).json({
                message: 'Ops, esse login já está sendo utilizado!',
            });
        }

        // eslint-disable-next-line object-curly-newline
        const { name, login, email, course } = req.body;
        const password = config.defaultCoordinatorPassword;
        const roles = [Roles.COORDINATOR];

        const newCoordinator = new User({
            name,
            login,
            email,
            course,
            password,
            roles,
        });
        const coordinator = await newCoordinator.save();

        if (!coordinator) {
            throw new Error('Houve um erro ao tentar cadastrar o coordenador!');
        }

        return res.status(201).json(coordinator.getPojoSchema());
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.getAllCoordinators = async function getAllCoordinators(req, res) {
    try {
        const coordinators = await User.findCoordinators({});

        return res.json(coordinators);
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.getCoordinator = async function getCoordinator(req, res) {
    try {
        const { coordinatorId } = req.params;
        const coordinator = await User.findCoordinators({ coordinatorId });

        return res.status(coordinator ? 200 : 404).json(coordinator);
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.updateCoordinator = async function updateCoordinator(req, res) {
    try {
        const { coordinatorId } = req.params;
        let coordinator = await User.findById(coordinatorId);

        if (!coordinator) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o coordenador informado.',
            });
        }

        if (coordinator.roles.includes(Roles.COORDINATOR)) {
            // eslint-disable-next-line object-curly-newline
            const { name, login, email, course } = req.body;

            const { modifiedCount } = await coordinator.updateOne({
                name,
                login,
                email,
                course,
            });

            const isSuccesfullyUpdated = Boolean(modifiedCount);
            const isResourceOwner = permissionUtils.isResourceOwner(req.userData.id, coordinatorId);
            let token;

            if (isSuccesfullyUpdated && isResourceOwner) {
                coordinator = await User.findById(coordinatorId);
                token = coordinator.generateAuthToken();
            }

            return res.status(isSuccesfullyUpdated ? 200 : 404).json({
                success: isSuccesfullyUpdated,
                message: isSuccesfullyUpdated ? undefined : 'Houve um erro ao tentar atualizar os dados do coordenador.',
                token,
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Somente é possível atualizar dados de coordenadores.',
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.deleteCoordinator = async function deleteCoordinator(req, res) {
    try {
        const { coordinatorId } = req.params;

        const { deletedCount } = await User.deleteOne({
            _id: coordinatorId,
        });

        const isSuccesfullyDeleted = Boolean(deletedCount);

        return res.status(isSuccesfullyDeleted ? 200 : 404).json({
            success: isSuccesfullyDeleted,
            message: isSuccesfullyDeleted ? undefined : 'Houve um erro ao tentar remover o coordenador.',
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
