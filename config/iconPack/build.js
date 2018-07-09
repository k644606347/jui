/**
 * @author jiangyu3
 * 用于构建icon pack，依赖fontawesome
 */
const fs = require('fs');
const path = require('path');
const fas = require('@fortawesome/free-solid-svg-icons');
const far = require('@fortawesome/free-regular-svg-icons');
const fab = require('@fortawesome/free-brands-svg-icons');

const prefixMap = {
    fas: 'solid',
    far: 'regular',
    fab: 'brand',
}

let iconGroups = [];
const buildDifineByIconPack = (iconPack) => {
    let content = ``;

    for (let k in iconPack) {
        let icon = iconPack[k],
            prefix = icon.prefix,
            iconName = k.replace(/^fa/, prefixMap[prefix]);
        if (!prefix)
            continue;
        // console.log(icon);
        content += `const ${iconName}: IconDefinition = ${JSON.stringify(icon)};\n`;

        let groupName = k.replace(/^fa/, 'icon');
        let iconGroup = iconGroups.find(g => g.name === groupName);

        if (!iconGroup) {
            iconGroup = {
                name: groupName,
                default: iconName,
                icons: [],
            }
            iconGroups.push(iconGroup);
        }
        iconGroup.icons.push({
            type: prefixMap[prefix],
            icon: iconName,
        });
    }

    return content;
}
let content = `import { IconGroup } from './IconGroup';
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
`;
content += buildDifineByIconPack(fas);
content += buildDifineByIconPack(far);
content += buildDifineByIconPack(fab);

const buildIconGroups = () => {
    return iconGroups.map(g => {
        return `export const ${g.name}: IconGroup = {
    default: ${g.default},
    ${g.icons.map(ico => `${ico.type}: ${ico.icon}`).join(',\n')}
}`}).join(';\n')
}

content += buildIconGroups();

let outputPath = path.resolve('../../src/components/icons/');
fs.writeFile(path.resolve(outputPath, 'FasIconPack.ts'), content, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});