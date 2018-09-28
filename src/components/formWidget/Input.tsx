import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import PureInput from '../PureInput';
import connectActiveForm from './connectActiveForm';
import { WidgetWrapper } from './WidgetWrapper';

const tools = Tools.getInstance();
class Input extends Widget<FormWidgetProps, FormWidgetState> {
    constructor(props: FormWidgetProps) {
        super(props);
    }
    render() {
        let { props, state } = this,
            { className, style, ...restProps } = props,
            { validateReport } = state,
            allowedInputElProps = this.getAllowedInputElAttrs(restProps),
            value = this.getValue();

        return (
            <WidgetWrapper style={style} className={className} validateReport={validateReport}>
                <PureInput
                    {...allowedInputElProps}
                    value={value} 
                    onChange={this.handleChange}
                />
            </WidgetWrapper>
        );
    }
}
export default connectActiveForm(Input);