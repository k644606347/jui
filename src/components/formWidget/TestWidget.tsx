import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import * as React from "react";
import wrapWidget from "./wrapWidget";

interface Props extends FormWidgetProps {
}
class TestWidget extends Widget<Props, FormWidgetState> {
    static defaultProps: Props = {
        id: 'testWidget',
        // validateTrigger: 'onBlur',
    }
    constructor(props: Props) {
        super(props);

        console.log(TestWidget.defaultProps, props);
    }
    render() {
        return <div>{ this.props.id }</div>;
    }
    focus() {
        //
    }
    blur() {
        //
    }
}

export default wrapWidget(TestWidget);