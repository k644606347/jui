import * as React from "react";
import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import PureTextarea from '../PureTextarea';
import connectActiveForm from "./connectActiveForm";
import { WidgetWrapper } from "./WidgetWrapper";
interface State {}
class Textarea extends Widget<FormWidgetProps, FormWidgetState> {
    render() {
        let { props, state } = this,
            { className, style } = props,
            { validateReport } = state;

        return <WidgetWrapper style={style} className={className} validateReport={validateReport}>
            <PureTextarea {...this.getAllowedInputElAttrs(props)} value={this.getValue()} onChange={this.handleChange} />
        </WidgetWrapper>
    }
}

export default connectActiveForm(Textarea);