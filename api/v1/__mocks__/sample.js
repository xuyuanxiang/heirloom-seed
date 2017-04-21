/**
 * @module
 * @description
 * @author xuyuanxiang
 * @date 2017/4/21
 */
require('isomorphic-fetch');

exports.get = async function (ctx) {
    const username = ctx.query.username;
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
        ctx.body = await response.json();
    } else {
        const text = await response.text();
        throw new Error(text);
    }
}
