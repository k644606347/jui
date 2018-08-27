import FormWidget, { FormWidgetProps, FormWidgetState } from "./FormWidget";
import * as React from "react";
import wrapWidget from "./wrapWidget";

interface Props extends FormWidgetProps {
}
class TestWidget extends FormWidget<Props, FormWidgetState> {
    constructor(props: Props) {
        super(props);

    }
    render() {
        return <div>onValid: { this.props.onValid }</div>;
    }
    focus() {
        //
    }
    blur() {
        //
    }
}

export default wrapWidget(TestWidget);