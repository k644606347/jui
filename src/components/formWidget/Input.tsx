import * as React from 'react';
import cssModules from './Input.scss';
import FormWidget, { FormWidgetProps, FormWidgetState } from './FormWidget';
import wrapWidget from './wrapWidget';
import Tools from '../../utils/Tools';
import cm from './Input.scss';

const tools = Tools.getInstance();
interface Props extends FormWidgetProps { }
class Input extends FormWidget<Props, {}> {
    private readonly inputRef: React.RefObject<any>;
    constructor(props: Props) {
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
