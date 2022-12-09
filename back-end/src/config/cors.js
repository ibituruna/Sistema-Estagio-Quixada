const cors = require('cors');

const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS || '*';
const allowedList = (corsAllowedOrigins).split(', ');

module.exports = cors({
    origin: (origin, callback) => {
        if ((!origin && allowedList.indexOf('*') !== -1) || (origin && allowedList.indexOf(origin) !== -1)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
});
