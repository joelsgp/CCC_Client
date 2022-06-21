const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require('./helpers')

module.exports = merge(
    common,
    {
        devtool: 'inline-source-map',
        mode: 'development',
        output: {
            path: helpers.output('../dist/js')
        }
    }
);
