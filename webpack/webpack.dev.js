const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = Object.assign(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        path: require("./helpers").output("../dist/js")
    }
});