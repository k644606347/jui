import * as React from "react";
import Widget, { FormWidgetProps } from "./Widget";
import textareaCSS from './Textarea.scss';
import { tools } from "../../utils/Tools";
import { DataType } from "./stores/DataConvertor";
import { Omit } from "../../utils/types";

let cssModules = tools.useCSS(textareaCSS);

type OmitAttrs = 'onChange' | 'onFocus' | 'onBlur';
export interface TextareaProps extends FormWidgetProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, OmitAttrs> {
    value?: string;
    defaultValue?: string;
}

const omitAttrs = ['validateReport', 'onChange', 'onFocus', 'onBlur'];
class Textarea extends Widget<TextareaProps> {
    cssObject = textareaCSS;
    dataType: DataType = 'string';
    constructor(props: TextareaProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props } = this,
            { className, ...restProps } = props,
            attrs = tools.omit(restProps, omitAttrs);

        if (attrs.defaultValue === undefined && attrs.value === undefined) {
            attrs.value = '';
        }
        return (
            <textarea {...attrs}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                className={tools.classNames(cssModules.wrapper, className)}/>
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