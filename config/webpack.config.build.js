
"use strict";

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const params = require('./params');
const cssConfigFile = require('./css.config');

let mode = process.env.NODE_ENV;
let cssConfig = cssConfigFile.get(mode);
let isProd = env => env === 'production';

let analyze;
if (process.env.npm_config_analyze) {
  analyze = !!JSON.parse(process.env.npm_config_analyze);
}
module.exports = {
    mode,
    entry: {
        jui: params.appIndex,
    },
    output: {
        path: params.appBuildLib,
        pathinfo: true,
        filename: `[name]${isProd(mode) ? '.min' : ''}.js?[chunkhash:8]`,
        chunkFilename: `[name].chunk${isProd(mode) ? '.min' : ''}.js?[chunkhash:8]`,
        library: '[name]',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: [
                            /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/
                        ],
                        loader: 'file-loader'
                    }, {
                        test: /\.(ts|tsx)$/,
                        use: [
                            {
                                loader: 'ts-loader',
                                options: {
                                    configFile: path.resolve('./tsconfig.prod.json')
                                }
                            }
                        ]
                    }, 
                    cssConfig
                ]
            }
        ]
    },
    devtool: 'source-map',
    externals: {
        'react-dom': 'react-dom',
        react: 'react',
        'react-is': 'react-is'
    },
    plugins: [
        mode === 'production' ? 
            new UglifyJsPlugin({
                parallel: true,
                cache: true,
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                },
            }) : '',
        new CopyPlugin([
            { from: './CHANGELOG.md', to: params.appBuildRoot },
            // { from: './README.md', to: params.appBuildRoot },
        ]),
        analyze && new BundleAnalyzerPlugin(),
    ].filter(n => !!n)
};