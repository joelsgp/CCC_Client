const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require("./helpers");

module.exports = merge(
    common, 
    {
        mode: 'production',
        output: {
            path: helpers.getReleaseDir()
        }
    }
);
