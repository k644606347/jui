import * as React from 'react';
import cssModules from './Input.scss';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import Tools from '../../utils/Tools';
import cm from './Input.scss';
import { InputProps } from './InputType';
import wrapWidget from './wrapWidget';

const tools = Tools.getInstance();
class Input extends Widget<InputProps, FormWidgetState> {
    private readonly inputRef: React.RefObject<any>;
    constructor(props: InputProps) {
        super(props);

        this.inputRef = React.createRef();
    }
    render() {
        let { className } = this.props,
            allowedInputElAttrs = this.getAllowedInputElAttrs(),
            value = this.getValue();

        return (
            <input
                {...allowedInputElAttrs}
                value={value} 
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
}

export default wrapWidget(Input);
