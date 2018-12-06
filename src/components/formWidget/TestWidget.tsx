import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import * as React from "react";
import connectActiveForm from "./connectActiveForm";

interface Props extends FormWidgetProps {
}
class TestWidget extends Widget<Props, FormWidgetState> {
    static defaultProps = {
        ...Widget.defaultProps,
        id: 'testWidget',
        value: '',
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

export default connectActiveForm<typeof TestWidget, FormWidgetProps>(TestWidget);