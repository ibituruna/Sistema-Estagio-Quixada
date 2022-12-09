/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const { Schema, Types, model } = require('mongoose');
const Steps = require('../utils/steps.json');
const OneSignal = require('../externals/oneSignal');

const NotificationSchema = new Schema({
    message: { type: String, required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: false },
    isRead: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

NotificationSchema.statics.getAllUserNotifications = function get(userId) {
    const recipient = Types.ObjectId(userId);

    return this
        .find({
            isRead: false,
            recipient,
        })
        .sort({
            createdAt: -1,
        })
        .select('-recipient')
        .lean();
};

NotificationSchema.statics.createNotifications = async function createNotifications(process, targetStepPosition, attributesModified) {
    const stepKey = Object.keys(Steps).find((step) => Steps[step].position === targetStepPosition);
    const stepNotifications = Steps[stepKey].notifications || {};
    const notifications = [];

    Object.keys(stepNotifications).forEach((notificableAttribute) => {
        if (!attributesModified[notificableAttribute]) {
            return;
        }

        const notificationSettings = stepNotifications[notificableAttribute];

        Object.keys(notificationSettings).forEach((notificationRecipient) => {
            const recipient = process[notificationRecipient];
            const launchUrl = OneSignal.configs.notificationLaunchUrls[notificationRecipient].replace(':processId', process._id);
            const message = notificationSettings[notificationRecipient]
                .replace('{tipoDocumento}', process.type === 'convencional' ? 'TCE' : 'contrato de trabalho');

            notifications.push({
                message,
                recipient,
                process,
                launchUrl,
            });
        });
    });

    try {
        notifications.forEach(async ({ message, launchUrl, recipient }) => {
            await OneSignal.sendNotification(message, launchUrl, recipient.toString());
        });
    } catch (e) {
        console.log('It was not possible to send OneSignal notifications: ', e.message);
    }

    return this.insertMany(notifications);
};

NotificationSchema.statics.createNotificationsForNewMessages = async function createNotifications(process, message) {
    const notificationRecipient = message.author.toString() !== process.student.toString() ? 'student' : 'coordinator';
    const recipient = process[notificationRecipient];
    const launchUrl = OneSignal.configs.notificationLaunchUrls[notificationRecipient].replace(':processId', process._id);
    const notificationMessage = 'Nova mensagem recebida no processo de estágio. Clique aqui para ler.';

    try {
        await OneSignal.sendNotification(notificationMessage, launchUrl, recipient.toString());
    } catch (e) {
        console.log('It was not possible to send OneSignal notifications: ', e.message);
    }

    return this.create({
        message: notificationMessage,
        recipient,
        process,
    });
};

const Notification = model('Notification', NotificationSchema);

module.exports = Notification;
