const webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("../build_tools/ManifestPlugin");

module.exports = {
    entry: {
        popup: path.join(__dirname, '../src/popup.tsx'),
        content_script_cc: path.join(__dirname, '../src/content_script_cc.ts'),
        inject_cc: path.join(__dirname, "../src/inject_cc.ts"),
        background: path.join(__dirname, "../src/background.ts"),
        patsyEditor: path.join(__dirname, "../src/patsyEditor_cs.ts")
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
                test: /\.css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // Copy plain files
        new CopyWebpackPlugin({
            patterns: [{
                from: "content",
                to: "../"
            }]
        }),

        // Manifest Tuner 
        new ManifestPlugin("../manifest.json")
    ]
};
