import Tools from "../../../utils/Tools";
import Log from "../../../utils/Log";

const tools = Tools.getInstance();

export type DataType = 'integer' | 'float' | 'string' | 'boolean' | 'array' | 'object';
export const dataTypes: DataType[] = ['integer', 'float', 'string', 'boolean', 'array', 'object'];

export default class DataConvertor {
    private static instances = [];
    static getInstance() {
        let instance;
        if (DataConvertor.instances.length === 0 ) {
            instance = new DataConvertor();
        } else 
            instance = DataConvertor.instances[0];

        return instance;
    }
    constructor() {
        //
    }
    convertTo(data: any, dataType: DataType) {
        let func = this[`convertTo${tools.upperCaseFirst(String(dataType))}`];

        if (!tools.isFunction(func)) {
            Log.throw(`不支持此数据格式的转换{ dataType=${dataType} }`);
        }
        return func(data);
    }
    convertToString(data: any) {
        return tools.isString(data) ? data : data === null || data === undefined ? '' : JSON.stringify(data);
    }
    convertToInteger(data: any) {
        if (data === null || data === undefined || data === '' || tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
            return 0;
        }

        if (typeof data === 'boolean') {
            return data ? 1 : 0;
        }

        data = Number.parseInt(data);
        if (Number.isNaN(data)) {
            Log.throw(`data无法转换为integer type{ data=${data} }`);
        }
        return data;
    }
    convertToFloat(data: any) {
        if (data === null || data === undefined || data === '' || tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
            return 0;
        }

        if (typeof data === 'boolean') {
            return data ? 1 : 0;
        }

        data = Number.parseFloat(data);
        if (Number.isNaN(data)) {
            Log.throw(`data无法转换为float type{ data=${data} }`);
        }
        return data;
    }
    convertToBoolean(data: any) {
			if (tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
				return false;
			} else if (tools.isString(data)) {
                let trimed = tools.removeZWSP(data).trim();
                return trimed === '0' ? false : !!trimed;
            } else 
                return !!data;
    }
    convertToArray(data: any) {
        if (tools.isArray(data))
            return data;
        
        if (tools.isString(data)) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = [];
            }
        } else {
            data = [];
        }

        return data;
    }
    convertToObject(data: any) {
        if (tools.isPlainObject(data))
            return data;
        
        if (tools.isString(data)) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = {};
            }
        } else {
            data = {};
        }

        return data;
    }
}