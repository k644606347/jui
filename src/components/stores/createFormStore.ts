class FormStore {
    private fields: any[];
    constructor(args: any) {
        this.fields = args.fields;
    }
    setFields(fields: any) {
        this.fields = fields;
    }
    setField(field: any) {
        let targetIndex = this.fields.findIndex(f => f.name === field.name);

        if (targetIndex === -1) {
            this.addField(field);
        }
        this.fields[targetIndex] = field;
    }
    addField(field: any) {
        this.fields.push(field);
    }
    setFieldValue(name: string, value: any) {
        let field = this.fields.find(f => f.name === name);

        if (field) {
            field.value = value;
        }
    }
    getValue() {
    }
}
const createFormStore = (...args: any[]) => new FormStore(args);
export default createFormStore;