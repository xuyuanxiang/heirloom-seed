/**
 * @description
 *  see: http://facebook.github.io/jest/docs/webpack.html#mocking-css-modules
 * @author xuyuanxiang
 * @date 2017/3/16
 */
const path = require('path');

module.exports = {
    process: (src, filename) => `module.exports = ${JSON.stringify(path.basename(filename))};`,
};
