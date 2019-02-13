import { AnyObject } from "./types";

export default class Tools {
    private static instances: Tools[] = [];
    static getInstance() {
        const instances = Tools.instances;

        return instances.length === 0 ? new Tools() : instances[0];
    }
    constructor() {
        // logic
    }

    isPlainObject(v: any): v is AnyObject {
        return Object.prototype.toString.call(v) === '[object Object]';
    }

    isEmptyObject(v: any): v is AnyObject {
        if (!this.isPlainObject(v)) {
            return false;
        }
        for (let p in v) {
            if (v.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    isFunction(v: any): v is (...args: any[]) => any {
        return v && Object.prototype.toString.call(v) === '[object Function]';
    }

    isBoolean(v: any): v is boolean {
        return typeof v === 'boolean';
    }

    isNumber(v: any): v is Number {
        return typeof v === 'number';
    }

    isString(v: any): v is string {
        return Object.prototype.toString.call(v) === '[object String]';
    }

    isArray(v: any): v is any[] {
        return Array.isArray(v);
    }
    isRegExp(v): v is RegExp {
        return Object.prototype.toString.call(v) === '[object RegExp]';
    }
    isError(v): v is Error {
        return Object.prototype.toString.call(v) === '[object Error]';
    }

    isPromise(v): v is Promise<any> {
        return Object.prototype.toString.call(v) === '[object Promise]';
    }

    genID(prefix?: string): string {
        let randomStr = () => this.randomInt(100000, 10000000).toString(16).substr(-5);

        return (prefix !== undefined ? prefix : '') + randomStr() + randomStr();
    }
    /**
     * demo randomInt(1, 9) => 1 ~ 9的随机整数，包含1和9
     * @param minVal
     * @param maxVal
     * @returns {number}
     */
    randomInt(minVal: number, maxVal?: number) {
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

    upperCaseFirst(str: string) {
        return str[0].toUpperCase() + str.substr(1);
    }

    lowerCaseFirst(str: string) {
        return str[0].toLowerCase() + str.substr(1);
    }

    trim(target: any) {
        if (target === undefined || target === null) {
            return '';
        } else {
            return String(target).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    }
    
    removeZWSP(content: string) {// 删除零宽空格(ZWSP), ZWSP参考：https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%A0%BC
        if (content === undefined || content === null || content === '') {
            return '';
        }
        return (content + '').replace(/[\ufeff\u200b\u200c\u200d]/g, '');
    }

    encodeAttr(val: string) {
        return val.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    encodeHTML(html: string) {
        let htmlEntities = {
            '"': '&quot;',
            "'": '&#39;',
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
        };
        return String(html).replace(/["'&<>]/g, char => htmlEntities[char] || char);
    }

    bindSelfMethod(methodNames: string[], context: object) {
        methodNames.forEach(name => {
            context[name] = context[name].bind(context);
        });
    }

    /**
     * @example 
     * tools.classNames('c1', 'c2', ['c3_1', 'c3_2'], 'c4'); // return 'c1 c2 c3_1 c3_2 c4'
     */
    classNames(...args: Array<string | Array<string | undefined> | undefined>): string {
        return args.filter(n => !!n).map(n => Array.isArray(n) ? this.classNames.apply(this, n) : n).join(' ');
    }

    supportTouchEvents(): boolean {
        return 'ontouchstart' in document && 'ontouchmove' in document && 'ontouchend' in document;
    }

    calculateCharsByteLength(str: string) {
        return str.replace(/[^\x00-\xff]/g, '__').length;
    }

    //  函数来自comos.js
    calculateMobileCharsLength(str: string) {
        const CHAR_MAP = { "0": 38.4, "1": 38.4, "2": 38.4, "3": 38.4, "4": 38.4, "5": 38.4, "6": 38.4, "7": 38.4, "8": 38.4, "9": 38.4, "A": 40, "B": 40, "C": 41, "D": 43, "E": 35, "F": 35, "G": 43, "H": 45, "I": 18, "J": 35, "K": 40, "L": 35, "M": 55, "N": 45, "O": 44, "P": 40, "Q": 45, "R": 41, "S": 39, "T": 38, "U": 43, "V": 40, "W": 55, "X": 40, "Y": 40, "Z": 38 };
        let result = 0;

        if (!str) {
            return 0;
        }
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i), charLen;
            
            if ((charCode >= 0x0001 && charCode <= 0x007e) || (0xff60 <= charCode && charCode <= 0xff9f)) {
                charLen = CHAR_MAP.hasOwnProperty(str[i]) ? CHAR_MAP[str[i]] / 64 : 0.5;
            } else {
                charLen = 1;
            }
            result += charLen;
        }

        result = (String(result) === result.toFixed(0) ? result : Number(result.toFixed(3)));
        return result;
    }

    // 需要依赖webpack变量注入
    isDev() {
        return process && process.env && process.env.NODE_ENV === "development";
    }

    /**
     * 去抖函数，执行delay后才会触发method，若在delay时间内又调用method则重新计算delay时间
     * 使用TS中的泛型剩余参数以及相应的元组类型推断的技术:
     * https://www.tslang.cn/docs/release-notes/typescript-3.0.html#generic-rest-parameters
     * @param method 
     * @param delay 
     */
    debounce<P extends any[]>(method: (...args: P) => any, delay: number) {
        let timer;
        return function(...args: P) {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                method.apply(this, args);
            }, delay);
        }
    }
    omit(obj: AnyObject = {}, omitKeys: string[] = []) {
        let result = {};

        if(!Array.isArray(omitKeys) || omitKeys.length === 0) {
            return {...obj};
        }
        for (let k in obj) {
            if (omitKeys.indexOf(k) === -1) {
                result[k] = obj[k];
            }
        }

        return result;
    }
}

let tools = Tools.getInstance();
export { tools }