import DataConvertor, { DataType, dataTypes } from "./DataConvertor";
import Log from "../../../utils/Log";

const convertor = DataConvertor.getInstance();
const defaultDataMap: {[key in DataType]?: any} = {
    integer: 0,
    float: 0,
    string: '',
    boolean: false,
    array: [],
    object: {},
};
// tslint:disable-next-line:interface-over-type-literal
type constructParam = { data: any, dataType: DataType };
export default class WidgetStore {
    private data: any;
    private dataType: DataType;
    constructor(args: constructParam) {
        let { data, dataType } = args;

        if (!dataType || !dataTypes.find(dt => dt === dataType)) {
            Log.throw(`只能设置为下列类型{ ${dataTypes.join(',')} }, 但是当前类型设置为${dataType}`);
        }
        this.dataType = dataType;
        
        this.setData(args.hasOwnProperty('data') ? data : this.getDefaultData());
        

    }
    getDefaultData() {
        return defaultDataMap[this.dataType];
    }
    getData() {
        return this.data;
    }
    setData(data: any) {
        this.data = this.formatData(data);
    }
    formatData(data: any) {
        return convertor.convertTo(data, this.dataType);
    }
    getDataType() {
        return this.dataType;
    }
}