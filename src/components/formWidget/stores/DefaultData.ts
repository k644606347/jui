import { DataType } from "./DataConvertor";

const defaultDataMap: {[key in DataType]?: any} = {
    integer: 0,
    float: 0,
    string: '',
    boolean: false,
    array: [],
    object: {},
};
export default {
    getBy(dataType: DataType) {
        return defaultDataMap[dataType];
    }
}