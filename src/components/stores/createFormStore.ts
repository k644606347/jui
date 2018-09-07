class FormStore {
    private fields: any[];
    constructor(args: any) {
        this.fields = args.fields;
    }
    setFields(fields: any) {
        this.fields = fields;
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
}
const createFormStore = (...args: any[]) => new FormStore(args);
export default createFormStore;