import * as React from "react";
import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import connectActiveForm from "./connectActiveForm";
import { WidgetWrapper } from "./WidgetWrapper";
import ValidateReportor from "./ValidateReportor";
import textareaCSS from './Textarea.scss';
import Tools from "../../utils/Tools";
import DataConvertor from "./stores/DataConvertor";

const tools = Tools.getInstance();
class Textarea extends Widget {
    static widgetName = 'textarea';
    static defaultProps = {
        value: '',
    }
    constructor(props: FormWidgetProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { className, style, value } = props,
            { validateReport } = state;

        return <React.Fragment>
            <WidgetWrapper style={style} className={className} validateReport={validateReport}>
                <textarea {...this.getAllowedInputElAttrs(props)} value={DataConvertor.getInstance().toString(value)} 
                    onChange={this.handleChange} 
                    style={{
                        color: ValidateReportor.getFontColor(validateReport)
                    }} 
                    className={tools.classNames(textareaCSS.wrapper, className)}/>
            </WidgetWrapper>
            { validateReport ? <ValidateReportor {...validateReport} /> : '' }
            </React.Fragment>
    }
    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let { onChange } = this.props,
            { value } = e.target;

        onChange && onChange(this.buildEvent({
            value,
        }));
    }
}

export default connectActiveForm(Textarea);