import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps } from './Widget';
import inputCSS from './Input.scss';
import { Omit } from '../../utils/types';
import { DataType } from './stores/DataConvertor';

const tools = Tools.getInstance();

type OmitAttrs = 'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onKeyUp' | 'onKeyPress';
export interface InputProps extends FormWidgetProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, OmitAttrs> {
    value?: string;
}
const omitAttrs = ['validateReport', 'onChange', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp', 'onKeyPress'];
class Input extends Widget<InputProps> {
    widgetName = 'input';
    dataType: DataType = 'string';
    constructor(props: InputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props } = this,
            {  className, ...restProps } = props,
            attrs = tools.omit(restProps, omitAttrs);

        // console.log('attrs', JSON.stringify(attrs));
        return (
            <input type="text" 
                {...attrs}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleKeyPress} 
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