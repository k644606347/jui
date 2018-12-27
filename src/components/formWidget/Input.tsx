import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps } from './Widget';
import inputCSS from './Input.scss';
import { Omit, AnyPlainObject } from '../../utils/types';
import { DataType } from './stores/DataConvertor';
import bindActiveForm from './bindActiveForm';

const tools = Tools.getInstance();

interface InputProps extends FormWidgetProps {
    value?: string;
    defaultValue?: string;
}
class Input extends Widget<InputProps> {
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
                className, style, 
                onValid, onInvalid, onValidating, 
                onDidMount, onWillUnmount,
                ...restProps 
            } = props,
            valueProps: AnyPlainObject = {};

            if (value !== undefined) {
                valueProps.value = this.parseValue();
            }
            if (defaultValue !== undefined) {
                valueProps.defaultValue = this.parseValue(defaultValue);
            }

        return (
            <input type="text" 
                {...restProps}
                {...valueProps}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleKeyPress} 
                style={style}
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