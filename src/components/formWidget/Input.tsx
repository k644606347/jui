import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps } from './Widget';
import inputCSS from './Input.scss';
import { AnyPlainObject } from '../../utils/types';
import { DataType } from './stores/DataConvertor';

const tools = Tools.getInstance();

export interface InputProps extends FormWidgetProps {
    value?: string;
    defaultValue?: string;
}

const allowedInputAttrs = ['id', 'name', 'value', 'readOnly', 'disabled', 'placeholder', 'title', 'className', 'style'];
class Input extends Widget<InputProps> {
    static getAttrsByProps(props: InputProps) {
        let result = {};
        for (let k in props) {
            if (allowedInputAttrs.indexOf(k) !== -1) {
                result[k] = props[k];
            }
        }

        return result;
    };
    widgetName = 'input';
    dataType: DataType = 'string';
    constructor(props: InputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props } = this,
            { 
                value, defaultValue, 
                className, 
            } = props,
            attrs = Input.getAttrsByProps(props),
            valueProps: AnyPlainObject = {};

            if (value !== undefined) {
                valueProps.value = this.parseValue();
            }
            if (defaultValue !== undefined) {
                valueProps.defaultValue = this.parseValue(defaultValue);
            }

        return (
            <input type="text" 
                {...attrs}
                {...valueProps}
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
// export default bindActiveForm<typeof Input, InputProps>(Input);
export default Input;