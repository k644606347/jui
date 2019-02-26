import * as React from "react";
import Widget, { FormWidgetProps, FormWidgetState } from "../../components/formWidget/Widget";
import { DataType } from "../../components/formWidget/stores/DataConvertor";
import bindActiveForm from "../../components/formWidget/bindActiveForm";

interface Props extends FormWidgetProps {
}
class CustomWidgetDemo extends Widget<Props, FormWidgetState> {
    cssObject = {};
    static defaultProps = {
        id: 'testWidget',
        value: '',
        // validateTrigger: 'onBlur',
    }
    widgetName = 'customWidgetDemo';
    dataType: DataType = 'string';
    constructor(props: Props) {
        super(props);

        console.log(CustomWidgetDemo.defaultProps, props);
    }
    render() {
        return <div>{ this.props.id }</div>;
    }
    handleChange(e: any) {
        let { onChange } = this.props;

        onChange && onChange(this.buildEvent());
    }
}

export default bindActiveForm<typeof CustomWidgetDemo, FormWidgetProps>(CustomWidgetDemo);