const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths ? // Making sure that the publicPath goes back to to build folder.
    {
        publicPath: Array(cssFilename.split('/').length).join('../')
    } : {};

const isProd = env => env === 'production';
const isDev = env => env === 'development';
const classNamePrefix = 'jui';
const buildPostCSSLoader = () => {
    return {
        loader: require.resolve("postcss-loader"),
        options: {
            ident: "postcss",
            plugins: () => [
                autoprefixer({
                    browsers: [
                        ">1%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9" // React doesn't support IE8 anyway
                    ],
                    flexbox: "no-2009"
                })
            ]
        }
    };
};
const getCSSConfig = (env, options) => {
    let config = {
            test: /\.css$/,
            use: [
                require.resolve("style-loader"),
                {
                    loader: require.resolve("css-loader"),
                    options: {
                        sourceMap: isDev(env),
                    }
                },
                postcssConfig
            ]
    };

    return config;
};

function getSCSSConfig(env, options) {
    return {
        test: /\.scss$/,
        use: [{
                loader: require.resolve("style-loader"),
                options: {
                    singleton: isProd(env),
                }
            },
            {
                loader: require.resolve("css-loader"),
                options: {
                    modules: true,
                    localIdentName: classNamePrefix + '-' + (isProd(env) ? "[name]_[hash:base64:5]" : "[name]-[local]_[hash:base64:3]"),
                }
            },
            postcssConfig,
            require.resolve("sass-loader")
        ]
    }
}
let postcssConfig = buildPostCSSLoader();
module.exports = {
    getConfigByEnv: (env, options) => {
        return {
            module: {
                rules: [{
                    oneOf: [
                        getCSSConfig(env, options),
                        getSCSSConfig(env, options),
                    ]
                }]
            }
        };
    }
};