/**
 * @author jiangyu3
 * 因fontawesome5.x图标库分为了多个文件，
 * 此脚本用于将fontawesome构建到到统一的单文件中
 * 命名冲突的图标名称将追加各自的suffix做区别
 */

const fs = require('fs');
const path = require('path');
const fas = require('@fortawesome/free-solid-svg-icons');
const far = require('@fortawesome/free-regular-svg-icons');
const fab = require('@fortawesome/free-brands-svg-icons');

const packInfoMap = {
    fas: {
        type: 'solid',
        module: '@fortawesome/free-solid-svg-icons',
    },
    far: {
        type: 'regular',
        suffix: 'r',
        module: '@fortawesome/free-regular-svg-icons',
    },
    fab: {
        type: 'brand',
        suffix: 'b',
        module: '@fortawesome/free-brands-svg-icons',
    }
};
let content = '',
    processedIconNames = [];

const buildDifineByIconPack = (iconPack) => {
    let content = `import {`,
        targetNames = [],
        prefix = iconPack.prefix,
        blackList = ['prefix', ...Object.keys(packInfoMap)],
        packInfo = packInfoMap[prefix];

    for (let originalName in iconPack) {
        let targetName = originalName.replace('fa', 'icon'),
            nameIsUnique = processedIconNames.indexOf(targetName) === -1;
        
        if (!nameIsUnique) {
            targetName = originalName.replace(/^fa(\w+)$/, `icon$1_${packInfo.suffix || packInfo.type}`);
        }
        
        if (blackList.indexOf(originalName) !== -1)
            continue;

        content += `\n    ${originalName} as ${targetName}, `;
            
        targetNames.push(targetName);
    }
    content += `\n} from '${packInfo.module}';\n`;
    content += `export {\n    `;
    targetNames.forEach(n => {
        content += `${n}, `;
    });
    content += `\n};\n`;
    processedIconNames = processedIconNames.concat(targetNames);

    return content;
}

content += buildDifineByIconPack(fas);
content += buildDifineByIconPack(far);
content += buildDifineByIconPack(fab);

let outputPath = path.resolve('../../src/components/icons/');
fs.writeFile(path.resolve(outputPath, 'FontAwesomeMap.ts'), content, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});