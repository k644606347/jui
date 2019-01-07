import * as React from "react";
import Widget, { FormWidgetProps } from "./Widget";
import textareaCSS from './Textarea.scss';
import Tools from "../../utils/Tools";
import { DataType } from "./stores/DataConvertor";
import bindActiveForm from "./bindActiveForm";
import { AnyPlainObject } from "../../utils/types";

const tools = Tools.getInstance();

const allowedInputAttrs = ['id', 'name', 'value', 'readOnly', 'disabled', 'placeholder', 'title', 'className', 'style'];

interface TextareaProps extends FormWidgetProps {
    value?: string;
    defaultValue?: string;
}
class Textarea extends Widget<TextareaProps> {
    static getAttrsByProps(props) {
        let result = {};
        for (let k in props) {
            if (allowedInputAttrs.indexOf(k) !== -1) {
                result[k] = props[k];
            }
        }

        return result;
    };
    widgetName = 'textarea';
    dataType: DataType = 'string';
    constructor(props: TextareaProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { value, defaultValue, className } = props,
            attrs = Textarea.getAttrsByProps(props),
            valueProps: AnyPlainObject = {};

            if (value !== undefined) {
                valueProps.value = this.parseValue();
            }
            if (defaultValue !== undefined) {
                valueProps.defaultValue = this.parseValue(defaultValue);
            }

        return (
            <textarea {...attrs}
                {...valueProps}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleKeyPress} 
                className={tools.classNames(textareaCSS.wrapper, className)}/>
        );
    }
    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let { onChange } = this.props,
            { value } = e.target;

        onChange && onChange(this.buildEvent({
            value,
        }));
    }
}

// export default bindActiveForm<typeof Textarea, TextareaProps>(Textarea);
export default Textarea;