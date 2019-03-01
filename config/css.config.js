"use strict";

const params = require('./params');
const isProd = env => env === 'production';
// const isDev = env => env === 'development';

function get(env) {
    return {
        test: /\.scss$/,
        use: [
            {
                loader: "style-loader",
                options: {
                    hmr: !isProd(env),
                    // insertAt: 'top',
                    // singleton: true,
                }
            },
            {
                loader: "css-loader",
                options: {
                    localIdentName: params.classNamePrefix + '-' + (isProd(env) ? "[hash:base64:5]" : "[name]-[local]_[hash:base64:3]"),
                    modules: true,
                    camelCase: true,
                }
            },
            "postcss-loader",
            "sass-loader"
        ]
    }
}
module.exports = {
    get,
};