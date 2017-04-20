/**
 * 启动文件
 * @author xuyuanxiang
 * @date 2017/2/10
 */
const NormalServer = require('heirloom-core').NormalServer;
const KoaEngine = require('heirloom-core').KoaEngine;
const StaticDevPlugin = require('heirloom-static-plugin').StaticDevPlugin;
const StaticPlugin = require('heirloom-static-plugin').StaticPlugin;
const log4js = require('log4js');
const constants = require('./conf/constants');

log4js.configure(constants.log4js);
log4js.setGlobalLogLevel(log4js.levels.getLevel(constants.LOG_LEVEL));

const server = new NormalServer({
    engine: KoaEngine.shareInstance(),
    logger: log4js.getLogger('server'),
    port: 3000,
});

if (constants.NODE_ENV === 'development') {
    server.apply(new StaticDevPlugin({
        root: __dirname,
        source: constants.PUBLIC_DIR,
        define: { API_ROOT: constants.API_ROOT },
    }));
} else {
    server.apply(new StaticPlugin({
        root: __dirname,
        source: constants.TARGET_DIR,
    }));
}

server.start();
