const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const params = require('./params');
const mode = 'production';

let analyze;
if (process.env.npm_config_analyze) {
  analyze = !!JSON.parse(process.env.npm_config_analyze);
}

module.exports = {
    mode,
    entry: {
        jui: params.appIndex
    },
    output: {
        path: params.appBuild,
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
                            {
                                loader: 'ts-loader',
                                options: {
                                    configFile: path.resolve('./tsconfig.prod.json')
                                }
                            }
                        ]
                    }, {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: "style-loader/useable",
                            }, {
                                loader: "css-loader",
                                options: {
                                    localIdentName: "[hash:base64:8]",
                                    modules: true,
                                    camelCase: true,
                                }
                            },
                            "postcss-loader",
                            "sass-loader"
                        ]
                    }
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
        analyze && new BundleAnalyzerPlugin(),
    ].filter(n => !!n)
};