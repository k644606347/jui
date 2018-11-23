const constants = require('./constants');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const mode = 'development';
module.exports = {
    mode,
    entry: {
        'jui': [
            constants.appIndex,
          ],
          'demo': constants.demoIndex,
    },
    output: {
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is served
        // by WebpackDevServer in development. This is the JS bundle containing code
        // from all our entry points, and the Webpack runtime.
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
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true,
                                }
                            }, {
                                loader: 'ts-loader',
                                options: {
                                    configFile: path.resolve('./tsconfig.json')
                                }
                            }
                        ]
                    }, {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: "style-loader",
                                options: {
                                    singleton: true,
                                }
                            }, {
                                loader: "css-loader",
                                options: {
                                    localIdentName: constants.classNamePrefix + '-' + "[name]-[local]_[hash:base64:3]",
                                    modules: true
                                }
                            },
                            "sass-loader"
                        ]
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        // Enable gzip compression of generated files.
        compress: true,
        // Silence WebpackDevServer's own logs since they're generally not useful. It
        // will still show compile warnings and errors with this setting.
        clientLogLevel: 'none',
        contentBase: path.resolve('./public'),
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve('./public/index.html')
        })
    ]
};