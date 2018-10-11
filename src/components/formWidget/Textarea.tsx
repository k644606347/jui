import * as React from "react";
import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import PureTextarea from '../PureTextarea';
import connectActiveForm from "./connectActiveForm";
import { WidgetWrapper } from "./WidgetWrapper";
import ValidateReportor from "./ValidateReportor";
interface State {}
class Textarea extends Widget<FormWidgetProps, FormWidgetState> {
    render() {
        let { props, state } = this,
            { className, style } = props,
            { validateReport } = state;

        return <React.Fragment>
            <WidgetWrapper style={style} className={className} validateReport={validateReport}>
                <PureTextarea {...this.getAllowedInputElAttrs(props)} value={this.getParsedValue()} 
                    onChange={this.handleChange} 
                    style={{
                        color: ValidateReportor.getFontColor(validateReport)
                    }} />
            </WidgetWrapper>
            { validateReport ? <ValidateReportor {...validateReport} /> : '' }
            </React.Fragment>
    }
}

export default connectActiveForm(Textarea);