const { Types } = require('mongoose');
const User = require('../models/user');
const Notification = require('../models/notification');
const permissionUtils = require('../utils/permissionUtils');

exports.loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const authenticationResult = await User.authenticateUser(login, password);

        if (!authenticationResult.success) {
            if (authenticationResult.isAccessDenied) {
                return res.status(401).json({
                    message: 'Erro ao Logar! Verifique as suas credenciais de autenticação.',
                });
            }

            return res.status(500).json({
                message: `Erro interno no servidor. Tente novamente mais tarde. Detalhes: ${authenticationResult.message}`,
            });
        }

        const { user } = authenticationResult;

        const token = user.generateAuthToken();
        const userData = user.getPojoSchema();
        const notifications = await Notification.getAllUserNotifications(userData.id);

        return res.status(200).json({
            user: {
                ...userData,
                notifications,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.returnUserProfile = async function returnUserProfile(req, res) {
    const notifications = await Notification.getAllUserNotifications(req.userData.id);

    res.json({
        ...req.userData,
        notifications,
    });
};

exports.readNotification = async function readNotification(req, res) {
    try {
        const { notificationId } = req.body;
        let notificationUpdateResult;
        let notifications;

        if (notificationId) {
            const notification = await Notification.findById(notificationId);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Não foi possível localizar a notificação solicitada.',
                });
            }

            const isResourceOwner = permissionUtils.isResourceOwner(
                req.userData.id,
                notification.recipient,
            );

            if (!isResourceOwner) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuário não possui permissão para modificar a notificação solicitada.',
                });
            }

            notification.set({
                isRead: true,
            });

            notificationUpdateResult = await notification.save();
        } else {
            notificationUpdateResult = await Notification.updateMany({
                recipient: Types.ObjectId(req.userData.id),
            }, {
                isRead: true,
            });
        }

        const isSuccesfullyUpdated = !!notificationUpdateResult;

        if (isSuccesfullyUpdated) {
            notifications = await Notification.getAllUserNotifications(req.userData.id);
        }

        return res.status(isSuccesfullyUpdated ? 200 : 400).json({
            success: isSuccesfullyUpdated,
            message: isSuccesfullyUpdated ? undefined : 'Houve um erro ao tentar atualizar a notificação.',
            notifications,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
