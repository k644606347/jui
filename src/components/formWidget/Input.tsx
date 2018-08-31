import * as React from 'react';
import cssModules from './Input.scss';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import Tools from '../../utils/Tools';
import cm from './Input.scss';
import { InputProps } from './InputType';
import wrapWidget from './wrapWidget';

const tools = Tools.getInstance();
class Input extends Widget<InputProps, {}> {
    private readonly inputRef: React.RefObject<any>;
    constructor(props: InputProps) {
        super(props);

        this.inputRef = React.createRef();
    }
    render() {
        let { className } = this.props,
            allowedInputElAttrs = this.getAllowedInputElAttrs();

        return (
            <input
                {...allowedInputElAttrs}
                className={
                    tools.classNames(cm.input, className)
                }
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur} 
                ref={this.inputRef}
            />
        );
    }
    focus() {
        this.inputRef.current.focus();
    }
    blur() {
        this.inputRef.current.blur();
    }
}

export default wrapWidget(Input);
