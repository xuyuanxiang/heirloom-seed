/**
 * @module
 * @description
 * @author xuyuanxiang
 * @date 2017/4/21
 */
require('isomorphic-fetch');
const logger = require('log4js').getLogger('api');

exports.get = async function (ctx, next) {
    logger.info(`${ctx.method} ${ctx.originalUrl}`);
    const username = ctx.query.username;
    if (!username) {
        await next;
        return;
    }
    const url = `https://api.github.com/users/${username}`;
    logger.info('Request:', url);
    const response = await fetch(url);
    logger.info(`Response: ${response.status}`);
    if (response.ok) {
        ctx.body = await response.json();
        logger.debug('Respond:', ctx.body);
    } else {
        const text = await response.text();
        logger.error('Unexpected:', ctx.body);
        throw new Error(text);
    }
}
