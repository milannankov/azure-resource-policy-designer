const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const settings = require('./webpack.settings');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            moduleFilenameTemplate: path.relative(settings.outputDir, '[resourcePath]')
        })
    ]
});