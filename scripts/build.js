/**
 * @description
 *  Docker构建中，构建JS；
 * @author xuyuanxiang
 * @date 2017/3/16
 */
const path = require('path');
const constants = require('../conf/constants');
const StaticPlugin = require('heirloom-static-plugin').StaticPlugin;

const staticPlugin = new StaticPlugin({
    root: path.resolve(__dirname, '../'),
    source: constants.PUBLIC_DIR,
    target: constants.TARGET_DIR,
    oss: 'none', // "none" - 不上传OSS， "aliyun" - 上传至阿里云OSS
    define: { API_ROOT: constants.API_ROOT },
});

staticPlugin.apply();
