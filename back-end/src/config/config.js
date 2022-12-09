const env = process.env.NODE_ENV;

require('dotenv').config({
    path: env === 'prod' ? '.env' : `.env.${env}`,
});

module.exports = {
    isProductionMode: env === 'prod',
    defaultCoordinatorPassword: process.env.DEFAULT_COORDINATOR_PASSWORD,
    oneSignal: {
        appId: process.env.ONE_SIGNAL_APP_ID,
        restApiKey: process.env.ONE_SIGNAL_REST_API_KEY,
        baseApiUrl: process.env.ONE_SIGNAL_BASE_API_URL,
        notificationApiUrl: process.env.ONE_SIGNAL_NOTIFICATION_API_URL,
        notificationLaunchUrls: {
            student: process.env.NOTIFICATION_LAUNCH_URLS_STUDENT,
            coordinator: process.env.NOTIFICATION_LAUNCH_URLS_COORDINATOR,
        },
    },
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        protocol: process.env.DB_PROTOCOL,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
    },
    token: {
        privateKey: process.env.TOKEN_SECRET,
        validity: process.env.TOKEN_VALIDITY,
    },
    superAdmin: {
        login: process.env.SUPER_ADMIN_LOGIN,
        password: process.env.SUPER_ADMIN_PASSWORD,
    },
};
