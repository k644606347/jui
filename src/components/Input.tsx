import * as React from 'react';
import { InputProps } from './InputType';
import cssModules from './Input.scss';
import Tools from '../utils/Tools';

const tools = Tools.getInstance();
class Input extends React.Component<InputProps, any> {

    render() {
        const {className, ref, ...restProps } = this.props;

        return (
            <input
                {...restProps}
                className={
                    tools.classNames(cssModules.input, className)
                }
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
            />
        );
    }

    handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        let value = e.target.value,
            { name, onFocus } = this.props;

        onFocus && onFocus({ name: name, value: value });
    }
    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        let value = e.target.value,
            { name, onBlur } = this.props;

        onBlur && onBlur({ name: name, value: value });
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value,
            { name, onChange } = this.props;

        onChange && onChange({ name: name, value: value });
    }
}

export default Input;
