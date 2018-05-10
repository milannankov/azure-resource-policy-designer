const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('vendor.css');
const settings = require('./webpack.settings');

module.exports = {
    stats: { modules: false },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
        ]
    },
    entry: {
        vendor: ['bootstrap', 'bootstrap/dist/css/bootstrap.css', 'react', 'react-dom', 'jquery', 'classnames', '@progress/kendo-ui', '@progress/kendo-dropdowns-react-wrapper', 'file-saver'],
    },
    output: {
        path: path.join(__dirname, settings.outputDir),
        publicPath: 'dist/',
        filename: '[name].js',
        library: '[name]_[hash]',
    },
    plugins: [
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
        new webpack.DllPlugin({
            context: path.join(__dirname, settings.root),
            path: path.join(__dirname, settings.outputDir, '[name]-manifest.json'),
            name: '[name]_[hash]'
        })
    ]
};
