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
    convertTo(data, dataType: DataType) {
        let func = this[`to${tools.upperCaseFirst(String(dataType))}`];
        return func(data);
    }
    toString(data) {
        return tools.isString(data) ? data : data === null || data === undefined ? '' : JSON.stringify(data);
    }
    toInteger(data) {
        if (data === null || data === undefined || data === '' || tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
            return 0;
        }

        if (typeof data === 'boolean') {
            return data ? 1 : 0;
        }

        data = Number.parseInt(data, 10);
        if (Number.isNaN(data)) {
            Log.error(`${data}无法转换为整数`);
        }
        return data;
    }
    toFloat(data) {
        if (data === null || data === undefined || data === '' || tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
            return 0;
        }

        if (typeof data === 'boolean') {
            return data ? 1 : 0;
        }

        data = Number.parseFloat(data);
        if (Number.isNaN(data)) {
            Log.error(`${data}无法转换为浮点数`);
        }
        return data;
    }
    toBoolean(data) {
			if (tools.isEmptyObject(data) || (tools.isArray(data) && data.length === 0)) {
				return false;
			} else if (tools.isString(data)) {
                let trimed = tools.removeZWSP(data).trim();
                return trimed === '0' ? false : !!trimed;
            } else 
                return !!data;
    }
    toArray(data) {
        if (tools.isArray(data))
            return data;
        
        if (tools.isString(data)) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                Log.error(`${data}无法转换为数组, error: ${e}`);
                data = [];
            }
        } else {
            data = [];
        }

        return data;
    }
    toObject(data) {
        if (tools.isPlainObject(data))
            return data;
        
        if (tools.isString(data)) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                Log.error(`${data}无法转换为对象, error: ${e}`);
                data = {};
            }
        } else {
            data = {};
        }

        return data;
    }
}