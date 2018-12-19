const webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("../build_tools/ManifestPlugin");
const fs = require("fs");

const OUTPUT = path.join( __dirname, "../dist" );

if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT);
}

module.exports = {
    entry: {
        popup: path.join(__dirname, '../src/popup.ts'),
        content_script_cc: path.join(__dirname, '../src/content_script_cc.ts'),
        style: path.join(__dirname, "../src/scss/style.scss"),
        inject_cc: path.join(__dirname, "../src/inject_cc.ts")
    },
    output: {
        path: path.join( OUTPUT, '/js' ),
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
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../webfonts/',    // where the fonts will go
                        publicPath: '../webfonts/'       // override the default path
                    }
                }]
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
        new ManifestPlugin("../manifest.json", "../dist/manifest.json"),

        // exclude locale files in moment
        //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};
