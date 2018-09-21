import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import Input, { InputChangeEvent } from '../Input';
import wrapWidget from './wrapWidget';
import Log from '../../utils/Log';

const tools = Tools.getInstance();
class Text extends Widget<FormWidgetProps, FormWidgetState> {
    constructor(props: FormWidgetProps) {
        super(props);
    }
    render() {
        let { className, ...restProps } = this.props,
            allowedInputElProps = this.getAllowedInputElAttrs(restProps),
            value = this.getValue();

        Log.log(allowedInputElProps);
        return (
            <Input
                {...allowedInputElProps}
                value={value} 
                className={
                    tools.classNames(className)
                }
                onChange={this.handleChange}
            />
        );
    }
    protected handleChange(e: InputChangeEvent) {
        let { value } = e,
            { id, name, onChange, disabled, readOnly } = this.props;

            this.setValue(value).then(val => {
                onChange && onChange({
                    id: id || '',
                    name: name || '',
                    value: val,
                    disabled: disabled || false,
                    readOnly: readOnly || false,
                });
            });

    }
}
export default wrapWidget(Text);