const webpack = require('webpack');
const merge = require('webpack-merge');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const helpers = require("./helpers");

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: helpers.getNameForRelease()
    }
});