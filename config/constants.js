"use strict";
const path = require("path");

module.exports = {
    classNamePrefix: 'jui',
    demoIndex: path.resolve('./src/demo/index.tsx'),
    appIndex: path.resolve('./src/index.tsx'),
    appBuild: path.resolve('../jui-release/lib'),
};
