"use strict";
const path = require("path");

module.exports = {
    classNamePrefix: 'jui',
    demoIndex: path.resolve('./src/demo/index.tsx'),
    appIndex: path.resolve('./src/JUI.tsx'),
    srcPath: path.resolve('./src'),
    packageJSON: path.resolve('./package.json'),
    appBuildLib: path.resolve('../jui-release/lib'),
    appBuildRoot: path.resolve('../jui-release'),
    nodeModulesPath: path.resolve('./node_modules'),
};
