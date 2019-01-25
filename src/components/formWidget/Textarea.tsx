import * as React from "react";
import Widget, { FormWidgetProps } from "./Widget";
import textareaCSS from './Textarea.scss';
import Tools from "../../utils/Tools";
import { DataType } from "./stores/DataConvertor";
import bindActiveForm from "./bindActiveForm";
import { Omit } from "../../utils/types";

type OmitAttrs = 'onChange' | 'onFocus' | 'onBlur';
export interface TextareaProps extends FormWidgetProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, OmitAttrs> {
    value?: string;
    defaultValue?: string;
}

const tools = Tools.getInstance();
const omitAttrs = ['validateReport', 'onChange', 'onFocus', 'onBlur'];
class Textarea extends Widget<TextareaProps> {
    static defaultProps = {
        value: ''
    }
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

export default Textarea;