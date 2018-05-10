const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.vendor.common.js');
const merge = require('webpack-merge');
const extractCSS = new ExtractTextPlugin('vendor.css');

module.exports = merge(common, {
    module: {
        rules: [
            { test: /\.css(\?|$)/, use: extractCSS.extract([ 'css-loader?minimize' ]) }
        ]
    },
    plugins: [
        extractCSS,
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.optimize.UglifyJsPlugin()
    ]
});