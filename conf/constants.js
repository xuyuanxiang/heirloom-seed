const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../');
const LOG_DIR = path.join(ROOT, 'logs');

if (!fs.existsSync(LOG_DIR) || !fs.statSync(LOG_DIR).isDirectory()) {
    fs.mkdirSync(LOG_DIR);
}
exports.log4js = {
    appenders: [
        { type: 'console' },
    ],
    replaceConsole: true,
};
exports.PORT = process.env.PORT || 3000;
exports.NODE_ENV = process.env.NODE_ENV || 'production';
exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
exports.LOG_DIR = LOG_DIR;
