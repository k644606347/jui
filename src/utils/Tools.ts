class Tools {
    constructor() {
        // logic
    }

    public isPlainObject(v: any) {
        return Object.prototype.toString.call(v) === '[object Object]';
    }

    public isEmptyObject(v: any) {
        if (!this.isPlainObject(v)){
            return false;
        }
        for (let p in v) {
            if (v.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    public isFunction(v: any) {
        return v && Object.prototype.toString.call(v) === '[object Function]';
    }

    public isString(v: any) {
        return Object.prototype.toString.call(v) === '[object String]';
    }

    public isArray(v: any) {
        return Array.isArray(v);
    }

    public genID(prefix: string) {
        let randomStr = () => this.randomInt(100000, 10000000).toString(16).substr(-5);

        return prefix + randomStr() + randomStr();
    }
    /**
     * demo randomInt(1, 9) => 1 ~ 9的随机整数，包含1和9
     * @param minVal
     * @param maxVal
     * @returns {number}
     */
    public randomInt(minVal: number, maxVal?: number) {
        maxVal = Number(maxVal);
        if (arguments.length === 0) {
            minVal = 0;
            maxVal = 9;
        } else if (arguments.length === 1) {
            if (minVal === 0) {
                maxVal = 9;
            }
            else {
                if (minVal > 0) {
                    maxVal = minVal;
                    minVal = 0;
                } else {
                    maxVal = 0;
                }
            }
        } else {
            minVal = Number.isInteger(minVal) ? minVal : Math.trunc(minVal);
            maxVal = Number.isInteger(maxVal) ? maxVal : Math.trunc(maxVal);
        }

        if (Number.isNaN(minVal) || Number.isNaN(maxVal)) {
            throw new Error('第1个和第2个参数值必须是数字');
        }

        if (maxVal <= minVal) {
            throw new Error('第2个参数值必须大于第1个参数值');
        }
        return Math.round(Math.random() * (maxVal - minVal) + minVal);
    }

    public upperCaseFirst(str: string) {
        return str[0].toUpperCase() + str.substr(1);
    }

    public lowerCaseFirst(str: string) {
        return str[0].toLowerCase() + str.substr(1);
    }

    public removeZWSP(content: string) {// 删除零宽空格(ZWSP), ZWSP参考：https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%A0%BC
        if (content === undefined || content === null || content === '') {
            return '';
        }
        return (content + '').replace(/[\ufeff\u200b\u200c\u200d]/g, '');
    }

    public encodeAttr(val: string) {
        return val.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    public encodeHTML(html:string) {
        let htmlEntities = {
            '"': '&quot;',
            "'": '&#39;',
            '<': '&lt;',
            '>': '&gt;',
            // tslint:disable-next-line:object-literal-sort-keys
            '&': '&amp;',
        };
        return html.replace(/["'&<>]/g, char => htmlEntities[char] || char);
    }

    public bindSelfMethod(methodNames: string[], context: object) {
        methodNames.forEach(name => {
            context[name] = context[name].bind(context);
        });
    }
}

export default new Tools();