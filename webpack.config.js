const path = require('path');

module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, 'modules'), 'node_modules'],
    },
};
