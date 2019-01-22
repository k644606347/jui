import * as React from "react";
import Widget, { FormWidgetProps } from "./Widget";
import textareaCSS from './Textarea.scss';
import Tools from "../../utils/Tools";
import { DataType } from "./stores/DataConvertor";
import bindActiveForm from "./bindActiveForm";
import { Omit } from "../../utils/types";

type OmitAttrs = 'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onKeyUp' | 'onKeyPress';
export interface InputProps extends FormWidgetProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, OmitAttrs> {
    value?: string;
}
interface TextareaProps extends FormWidgetProps {
    value?: string;
    defaultValue?: string;
}

const tools = Tools.getInstance();
const omitAttrs = ['validateReport', 'onChange', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp', 'onKeyPress'];
class Textarea extends Widget<TextareaProps> {
    static defaultProps = {
        value: ''
    }
    widgetName = 'textarea';
    dataType: DataType = 'string';
    constructor(props: TextareaProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { className, ...restProps } = props,
            attrs = tools.omit(restProps, omitAttrs);
        return (
            <textarea {...attrs}
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