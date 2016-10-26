/**
 * @description
 * @version 1.0.0
 * @author xuyuanxiang
 * @date 16/9/24
 */
var _ = require('lodash');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var pkg = require('../package.json');
var env = process.env.NODE_ENV;
var configs = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve('./public'),
        filename: pkg.name + '.js?[hash]',
        publicPath: '/'
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.[s]?css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract([
                    `css?${process.env.NODE_ENV !== 'production' ? 'sourceMap' : 'minimize'}`,
                    'postcss?parser=postcss-scss'
                ])
            },
            {
                test: /\.ts[x]?$/,
                exclude: /node_modules/,
                loader: 'ts',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000',
            },
            {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader',
            }
        ],
        preLoaders: [
            {
                test: /\.ts[x]?$/,
                loader: "tslint"
            }
        ]
    },
    tslint: {
        configuration: require('../tslint.json'),
        emitErrors: true,
        failOnHint: true
    },
    postcss: function plugins(bundler) {
        return [
            require('postcss-import')({addDependencyTo: bundler}),
            require('precss')(),
            require('autoprefixer')({
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 35',
                    'Firefox >= 31',
                    'Explorer >= 8',
                    'iOS >= 7',
                    'Opera >= 12',
                    'Safari >= 7.1'
                ]
            }),
        ];
    },
    plugins: [
        new ExtractTextPlugin(pkg.name + '.css?[hash]'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new HtmlWebpackPlugin({
            title: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords.join(','),
            template: path.resolve('./src/index.ejs')
        })
    ]
}
// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    configs,
    require('./' + (process.env.NODE_ENV || 'development') + '.js') || {});