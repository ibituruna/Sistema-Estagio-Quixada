const axios = require('axios');
const path = require('path');
const https = require('https');
const sslRootCas = require('ssl-root-cas');
const { oneSignal } = require('../config/config');

function createAxiosInstance() {
    const rootCas = sslRootCas.create();

    rootCas.addFile(path.resolve(__dirname, '_.onesignal.com.chained.crt'));

    const httpsAgent = new https.Agent({
        ca: rootCas,
    });

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${oneSignal.restApiKey}`,
    };

    return axios.create({
        baseURL: oneSignal.baseApiUrl,
        validateStatus: (status) => status >= 200 && status <= 302,
        httpsAgent,
        headers,
    });
}

exports.sendNotification = async function sendNotification(message, launchUrl, externalUserId) {
    const payload = {
        app_id: oneSignal.appId,
        headings: { en: 'Atualização no Processo de Estágio' },
        contents: { en: message },
        channel_for_external_user_ids: 'push',
        include_external_user_ids: [externalUserId],
        url: launchUrl,
    };

    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.post(oneSignal.notificationApiUrl, payload);

        return response.data;
    } catch (e) {
        console.log('It was not possible to send a OneSignal notification: ', e.message);
    }

    return null;
};

exports.configs = oneSignal;
