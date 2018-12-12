import * as React from "react";
import Widget, { FormWidgetProps } from "./Widget";
import textareaCSS from './Textarea.scss';
import Tools from "../../utils/Tools";
import { DataType } from "./stores/DataConvertor";
import bindActiveForm from "./bindActiveForm";

const tools = Tools.getInstance();

interface TextareaProps extends FormWidgetProps {
    value?: string;
    defaultValue?: string;
}
class Textarea extends Widget<TextareaProps> {
    widgetName = 'textarea';
    dataType: DataType = 'string';
    constructor(props: TextareaProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { value, defaultValue, className, style, onValid, onInvalid, onDidMount, ...restProps } = props;

        return (
            <textarea {...restProps}
                value={value === undefined ? this.parseValue() : value} 
                defaultValue={defaultValue === undefined ? this.parseValue(defaultValue) : defaultValue} 
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleKeyPress} 
                style={style} 
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

export default bindActiveForm<typeof Textarea, TextareaProps>(Textarea);