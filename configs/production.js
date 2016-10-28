/**
 * @name
 * @description
 * @version 1.0.0
 * @author xuyuanxiang
 * @date 16/9/24
 */
"use strict";

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin');
var path = require('path');
var util = require('util');
var pkg = require('../package.json');
var aliyun = pkg.aliyun;

// Production specific configuration
// =================================
var production = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin(util.format('%s-%s.[hash].css', pkg.name, pkg.version)),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        }),
        new webpack.BannerPlugin(
            pkg.name + pkg.version
            + "\nCreated by\t" + pkg.author
            + "\nCopyright © " + new Date().getFullYear() + "年 Wosai-Inc. All rights reserved."
        ),
        new HtmlWebpackPlugin({
            title: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords.join(','),
            template: path.resolve('./src/index.ejs')
        })
    ]
};

if (aliyun.region && aliyun.accessKeyId && aliyun.accessKeySecret && aliyun.bucket) {
    production.output = {
        path: path.resolve('./public'),
        filename: util.format('%s-%s.[hash].js', pkg.name, pkg.version),
        publicPath: '//statics.wosaimg.com/assets/'
    };

    production.plugins.push(new AliyunossWebpackPlugin({
        buildPath: path.resolve('./public'),
        region: 'oss-cn-hangzhou',
        accessKeyId: '****',
        accessKeySecret: '****',
        bucket: '****',
        generateObjectPath: function (filename) {
            return 'assets/' + filename;
        }
    }));
}

module.exports = production;