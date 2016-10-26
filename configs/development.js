/**
 * @name
 * @description
 * @version 1.0.0
 * @author xuyuanxiang
 * @date 16/9/24
 */


"use strict";

// Development specific configuration
// ==================================
module.exports = {
    devtool: "source-map",
    module: {
        preLoaders: {test: /\.js$/, loader: "source-map-loader"}
    }
};