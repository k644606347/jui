"use strict";

const params = require('./params');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const path = require('path');
const cssConfigFile = require('./css.config');

const mode = 'development';
const cssConfig = cssConfigFile.get(mode);

module.exports = {
    mode,
    entry: {
        demo: [
            params.demoIndex,
            require.resolve('react-dev-utils/webpackHotDevClient'),
        ],
        jui: [
            params.appIndex,
        ]
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "jui",
                    chunks: "initial",
                }
            }
        }
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
                                    configFile: path.resolve('./tsconfig.json')
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
    devServer: {
        clientLogLevel: 'none',
        contentBase: path.resolve('./public'),
        compress: true, // 启用gzip
        host: '0.0.0.0',// 外部也可访问网站
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve('./public/index.html')
        }),
        new WatchMissingNodeModulesPlugin(params.nodeModulesPath),
    ]
};