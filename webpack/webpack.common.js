const webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("../build_tools/ManifestPlugin");

module.exports = {
    entry: {
        popup: path.join(__dirname, '../src/popup.ts'),
        content_script_cc: path.join(__dirname, '../src/content_script_cc.ts'),
        style: path.join(__dirname, "../src/scss/style.scss"),
        inject_cc: path.join(__dirname, "../src/inject_cc.ts"),
        docs: path.join(__dirname, "../src/docs.ts"),
        docs_style: path.join(__dirname, "../src/scss/docs.scss"),
        background: path.join(__dirname, "../src/background.ts")
    },
    output: {
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // Copy plain files
        new CopyWebpackPlugin([{
            from: "content",
            to: "../"
        }]),

        // Manifest Tuner 
        new ManifestPlugin("../manifest.json"),

        // Replace Env
        new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function (resource) {
            resource.request = resource.request.replace(/-APP_TARGET/, `-${env}`);
        })
    ]
};
