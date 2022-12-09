const axios = require('axios');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');
const sslRootCas = require('ssl-root-cas');
const Roles = require('../utils/roles.json');

function createAxiosInstance() {
    const rootCas = sslRootCas.create();

    rootCas.addFile(path.resolve(__dirname, '_.quixada.ufc.br.chained.crt'));

    const httpsAgent = new https.Agent({
        ca: rootCas,
    });

    return axios.create({
        baseURL: 'https://identidadepessoa.quixada.ufc.br',
        validateStatus: (status) => status >= 200 && status <= 302,
        httpsAgent,
    });
}

function getAuthenticationCookieFromHeaders(headers) {
    const authenticationCookie = headers['set-cookie'] || [];

    if (!authenticationCookie.length) {
        return null;
    }

    // Sometimes the header will have more than one set-cookie value.
    // We must always use the latest cookie.
    return authenticationCookie[authenticationCookie.length - 1].split(';')[0];
}

async function doAuthentication(axiosInstance, login, password) {
    const params = {
        usuario: login,
        senha: password,
    };

    const payload = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    const response = await axiosInstance.post('/login.php', payload, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0,
    });

    const { headers } = response;

    if (headers.location === 'acessonegado') {
        return {
            success: false,
            isAccessDenied: true,
        };
    }

    const authenticationCookie = getAuthenticationCookieFromHeaders(headers);

    return {
        success: true,
        authenticationCookie,
    };
}

async function getDashboardContent(axiosInstance, cookieAuthentication) {
    const response = await axiosInstance.get('/dashboard/', {
        headers: {
            Cookie: cookieAuthentication,
        },
    });

    const { data } = response;

    return data;
}

async function getExternalProfileData(login, password) {
    try {
        const axiosInstance = createAxiosInstance();
        const authenticationResult = await doAuthentication(axiosInstance, login, password);

        if (!authenticationResult.success) {
            return authenticationResult;
        }

        const dashboardContent = await getDashboardContent(
            axiosInstance,
            authenticationResult.authenticationCookie,
        );

        const $ = cheerio.load(dashboardContent);

        const name = $('.glyphicon-user').parent('p').text().trim();
        const email = $('.fa-envelope').parent('p').text().trim();
        const course = [$('.fa-sitemap').parent('p').text().trim()];
        const roles = [Roles.STUDENT];

        return {
            success: true,
            login,
            name,
            email,
            course,
            roles,
        };
    } catch (error) {
        return {
            success: false,
            isInternalError: true,
            message: error.message,
        };
    }
}

module.exports = {
    getExternalProfileData,
};
