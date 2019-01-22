import { Report, validator } from "./Validator";
import { tools } from "../utils/Tools";
import Log from "../utils/Log";
import { AnyFunction } from "../utils/types";

export type AllowedRule = 'required' | 'maxLength' | 'minLength' | 'maxZhLength' | 'minZhLength' 
    | 'regexp' | 'email' | 'url' | 'domain' | 'mobilePhone' | 'date' | 'datetime' | 'callback';
export type ShorthandRule = 'required' | 'email' | 'url' | 'domain' | 'mobilePhone' | 'date' | 'datetime';

const allowedRules: AllowedRule[] = [
    'required', 'maxLength', 'minLength', 'maxZhLength', 'minZhLength', 
    'regexp', 'email', 'url', 'domain', 'mobilePhone', 'date', 'datetime', 'callback'
];
const shorthandRules: ShorthandRule[] = [
    'required', 'email', 'url', 'domain', 'mobilePhone', 'date', 'datetime'
];
type IProcessors = { [k in AllowedRule]: AnyFunction };
class Processors implements IProcessors {
    required(value) {
        if (tools.isArray(value)) {
            return value.length > 0;
        } else if (tools.isPlainObject(value)) {
            return !tools.isEmptyObject(value);
        } else {
            return String(value) !== "" && value !== undefined && value !== null;
        }
    }
    maxLength(value, validValue) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验maxLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return value.length <= Number(validValue);
    }
    minLength(value, validValue) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验minLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return value.length >= Number(validValue);
    }
    maxZhLength(value, validValue) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验maxZhLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return tools.calculateCharsByteLength(value) / 2 <= Number(validValue);
    }
    minZhLength(value, validValue) {
        if (!tools.isString(value) && !tools.isArray(value)) {
            value = String(value);
            Log.warn(`校验minZhLength时，值必须是string/array，但当前值是${JSON.stringify(value)}，将会强制转换值为string做校验`);
        }
        return tools.calculateCharsByteLength(value) / 2 >= Number(validValue);
    }
    regexp(value, pattern: RegExp) {
        return pattern.test(value);
    }
    email(value) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(String(value));
    }
    url(value) {
        return /^http[s]?:\/\/[\w\-]+\.[\w\-]+.*/.test(String(value));
    }
    domain(value) {
        return /^http[s]?:\/\/[\w]+\.[\w]+\/?/.test(String(value));
    }
    mobilePhone(value) {
        return /^0?1[3|4|5|8|7][0-9]\d{8}$/.test(String(value));
    }
    datetime(value) {
        return /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
            String(value)
        );
    }
    date(value) {
        return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(value));
    }
    async callback(value: string, callback: AnyFunction): Promise<Report> {
        let callbackResult: boolean | string | Report,
            result: Report;

        if (!tools.isFunction(callback)) {
            throw new Error(`无效的校验配置，callback必须是函数, 当前是: ${callback}`);
        }
        try {
            callbackResult = await callback(value);
        } catch (e) {
            if (tools.isError(e)) {
                throw e;
            } else {
                callbackResult = e;
            }
        }

        if (tools.isBoolean(callbackResult)) {
            result = {
                isValid: !!callbackResult,
            };
            if (!result.isValid)
                result.level = 'error';
        } else if (validator.isValidReport(callbackResult)) {
            result = callbackResult;
        } else {
            let errorMsg = `校验函数返回错误，请检查, 
            当前返回: ${JSON.stringify(callbackResult)}, 
            有效的返回: boolean | { isValid: boolean, level: 'error' | 'warn', msg?: string, fieldName?: string}`;

            throw new Error(errorMsg);
        }

        return result;
    }
}

export default Processors;
let processors = new Processors();
export { processors, allowedRules, shorthandRules };
