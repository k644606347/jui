import * as React from "react";
import { FormProps } from "./FormType";
import Tools from "../utils/Tools";
import Field from "./Field";
import cssModules from './Form.scss';
import Log from "../utils/Log";
import { FormContext } from "./Form-Context";
import Config from "./formWidget/Config";
import { FieldProps } from "./FieldType";

const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, any> {
    static isWidgetElement = (node: React.ReactNode) => {
        let isWidget = false;
        if (!React.isValidElement(node)) {
            return false;
        }
        for (let key in Config) {
            if (node.type === Config[key].widget) {
                isWidget = true;
                break;
            }
        }
        return isWidget;
    }
    constructor(props: FormProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { fields, children } = props;

        return (
            <FormContext.Provider value={{ onChange: this.handleChange }}>
                <form className={cssModules.wrapper}>
                    {
                        fields ? this.renderFields(fields) : children
                    }
                </form>
            </FormContext.Provider>
        )
    }
    private renderFields(fields: FieldProps[]) {
        return (
            <React.Fragment>
                {
                    fields.map((field: FieldProps, i) => {
                        let { widget, label, renderWidget, ...widgetProps } = field;
                        return (
                            <Field key={i} label={label} widget={widget} widgetProps={widgetProps} renderWidget={renderWidget}></Field>
                        )
                    })
                }
            </React.Fragment>
        )
    }
    // TOOD 回调处理
    handleChange(e: any) {
        let { onChange } = this.props;

        onChange && onChange(e);
    }
}