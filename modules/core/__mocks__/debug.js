const createDebug = require('debug');

exports.createDebug = category => createDebug(`com.wosai.shouqianba-h5:${category}`);
