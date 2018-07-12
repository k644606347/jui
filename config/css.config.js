const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
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
const classNamePrefix = 'cmui';
const buildPostCSSLoader = () => {
    return {
        loader: require.resolve("postcss-loader"),
        options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: "postcss",
            plugins: () => [
                require("postcss-flexbugs-fixes"),
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
    let configMap = {
        development:
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        {
            test: /\.css$/,
            use: [
                require.resolve("style-loader"),
                {
                    loader: require.resolve("css-loader"),
                    options: {
                        importLoaders: 1
                    }
                },
                postcssConfig
            ]
        },
        production:
        // The notation here is somewhat confusing.
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader normally turns CSS into JS modules injecting <style>,
        // but unlike in development configuration, we do something different.
        // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
        // (second argument), then grabs the result CSS and puts it into a
        // separate file in our build process. This way we actually ship
        // a single CSS file in production instead of JS code injecting <style>
        // tags. If you use code splitting, however, any async bundles will still
        // use the "style" loader inside the async code so CSS from them won't be
        // in the main CSS file.
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                Object.assign({
                        fallback: {
                            loader: require.resolve("style-loader"),
                            options: {
                                hmr: false
                            }
                        },
                        use: [{
                                loader: require.resolve("css-loader"),
                                options: {
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: shouldUseSourceMap
                                }
                            },
                            postcssConfig
                        ]
                    },
                    extractTextPluginOptions
                )
            )
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
        }
    };

    let config = configMap[env];
    if (!config) {
        throw new Error(`env:\`${env}\`下缺少.css文件的加载器配置，请追加`);
    }

    return config;
};

function getSCSSConfig(env, options) {
    return {
        test: /\.scss$/,
        use: [
            require.resolve("style-loader"),
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