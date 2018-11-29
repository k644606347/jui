const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const constants = require('./constants');

const mode = 'production';

let analyze;
if (process.env.npm_config_analyze) {
  analyze = !!JSON.parse(process.env.npm_config_analyze);
}

module.exports = {
    mode,
    entry: {
        'jui': constants.appIndex
    },
    output: {
        path: constants.appBuild,
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
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
                            // {
                            //     loader: 'babel-loader',
                            //     options: {
                            //         cacheDirectory: true,
                            //     }
                            // }, 
                            {
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
                                loader: "style-loader"
                            }, {
                                loader: "css-loader",
                                options: {
                                    localIdentName: "[hash:base64:8]",
                                    modules: true,
                                    camelCase: true,
                                }
                            },
                            "sass-loader"
                        ]
                    }
                ]
            }
        ]
    },
    devtool: 'none',
    externals: {
        react: 'react',
        'react-is': 'react-is'
    },
    plugins: [
        analyze && new BundleAnalyzerPlugin(),
        new UglifyJsPlugin({
            parallel: true,
            cache: true,
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                },
            },
        }),
    ].filter(n => !!n)
};