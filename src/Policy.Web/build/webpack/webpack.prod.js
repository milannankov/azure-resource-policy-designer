const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const settings = require('./webpack.settings');

module.exports = merge(common, {
    module: {
        rules: [
            { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader?minimize' }) }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('app.css')
    ]
});