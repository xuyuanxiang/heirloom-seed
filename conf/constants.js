const path = require('path');
const fs = require('fs');

const LOG_DIR = path.join(__dirname, 'logs');

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
exports.PUBLIC_DIR = path.join(__dirname, 'public');
exports.TARGET_DIR = path.join(__dirname, 'dist');
exports.API_ROOT = '/api/';

if (exports.NODE_ENV === 'development') {
    // 开发时，本地mock接口返回数据
    exports.API_DIR = path.join(__dirname, 'api/__mocks__');
} else {
    exports.API_DIR = path.join(__dirname, 'api');
}