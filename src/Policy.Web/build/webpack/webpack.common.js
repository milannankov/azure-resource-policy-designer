const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const settings = require('./webpack.settings');

module.exports = {
    stats: { modules: false },
    entry: {
        'index': './ClientApp/index.tsx'
    },
    resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    output: {
        path: path.join(__dirname, settings.outputDir),
        filename: '[name].js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            { test: /\.tsx?$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },
            // Can we have this as default? { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader?minimize' }) },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, settings.root),
            manifest: require(settings.outputDir + '/vendor-manifest.json')
        })
    ]
};