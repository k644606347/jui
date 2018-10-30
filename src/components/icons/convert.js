const fs = require('fs');
const path = require('path');
let bf = fs.readFileSync('IconFont.ts');
// console.log(bf.toString());
// let data = bf.toString().replace(/icon([\w-]+)\s*=/g, (whole, name) => {
//     return 'icon' + name.replace(/[-\_]([a-z0-9A-Z])/g, (whole2, char) => char.toUpperCase()) + ' = ';
// });
// data = bf.toString().replace(/name:\s*(['"])(\w+)\1/g, (whole, quot, name) => {
//     return `name: ${quot}${name.charAt().toLowerCase()}${name.substring(1)}${quot}`;
// });
let fileStr = bf.toString();
let names = fileStr.match(/(icon[\w]+)/g);

let exportStr = 'export {\n';
names.forEach(name => {
    exportStr = exportStr + name + ', ';
});
exportStr += '\n}';
fileStr = fileStr + '\n' + exportStr; 
fs.writeFileSync('IconFont2.ts', fileStr);