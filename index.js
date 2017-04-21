/**
 * 启动文件
 * @author xuyuanxiang
 * @date 2017/2/10
 */
const NormalServer = require('heirloom-core').NormalServer;
const KoaEngine = require('heirloom-core').KoaEngine;
const StaticDevPlugin = require('heirloom-static-plugin').StaticDevPlugin;
const StaticPlugin = require('heirloom-static-plugin').StaticPlugin;
const APIPlugin = require('heirloom-api-plugin').HeirloomAPIPlugin;
const log4js = require('log4js');
const constants = require('./conf/constants');

log4js.configure(constants.log4js);
log4js.setGlobalLogLevel(log4js.levels.getLevel(constants.LOG_LEVEL));

const server = new NormalServer({
    engine: KoaEngine.shareInstance(),
    logger: log4js.getLogger('server'),
    port: 3000,
});

server.apply(new APIPlugin());

if (constants.NODE_ENV === 'development') {
    server.apply(new StaticDevPlugin({
        define: { API_ROOT: '/api' },
    }));
} else {
    server.apply(new StaticPlugin({
        define: { API_ROOT: '/api/' },
    }));
}

server.start();
