"use strict";
const path = require("path");

module.exports = {
    classNamePrefix: 'jui',
    demoIndex: path.resolve('./src/demo/index.tsx'),
    appIndex: path.resolve('./src/index.tsx'),
    srcPath: path.resolve('./src'),
    packageJSON: path.resolve('./package.json'),
    appBuild: path.resolve('../jui-release/lib'),
    nodeModulesPath: path.resolve('./node_modules'),
};
