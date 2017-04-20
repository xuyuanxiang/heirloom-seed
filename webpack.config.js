const path = require('path');

module.exports = {
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    resolve: {
        modules: [path.resolve(__dirname, 'modules'), 'node_modules'],
    },
};
