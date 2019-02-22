import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps } from './Widget';
import inputCSS from './Input.scss';
import { Omit, AnyObject } from '../../utils/types';
import { DataType } from './stores/DataConvertor';

const tools = Tools.getInstance();

type OmitAttrs = 'onChange' | 'onFocus' | 'onBlur';
export interface InputProps extends FormWidgetProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, OmitAttrs> {
    value?: string;
}
const omitAttrs = ['validateReport', 'onChange', 'onFocus', 'onBlur'];
class Input extends Widget<InputProps> {
    dataType: DataType = 'string';
    constructor(props: InputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props } = this,
            {  className, ...restProps } = props,
            attrs = tools.omit(restProps, omitAttrs);

            console.log('Input render');
        if (attrs.defaultValue === undefined && attrs.value === undefined) {
            attrs.value = '';
        }

        // TODO autoFocus属性无法生效
        return (
            <input type="text" 
                {...attrs}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                className={tools.classNames(inputCSS.input, className)}
            />
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target,
            { onChange } = this.props;

        onChange && onChange(this.buildEvent({
            value,
        }));
    }
}
export default Input;