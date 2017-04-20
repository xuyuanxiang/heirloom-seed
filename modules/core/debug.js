const createDebug = require('debug');

if (process.env.NODE_ENV === 'production') {
    localStorage.removeItem('debug');
} else {
    localStorage.debug = 'com.wosai.shouqianba-h5:*';
}

exports.createDebug = category => createDebug(`com.wosai.shouqianba-h5:${category}`);
