import * as React from "react";
import { Omit } from "../../utils/types";
import cm from './Textarea.scss';
import Tools from "../../utils/Tools";
import Widget, { FormWidgetProps, FormWidgetState } from "./Widget";
import wrapWidget from "./wrapWidget";
interface State {}

const tools = Tools.getInstance();
class Textarea extends Widget<FormWidgetProps, FormWidgetState> {
    render() {
        let { className } = this.props;

        return <textarea className={tools.classNames(cm.wrapper, className)} onChange={this.handleChange} />
    }
}

export default wrapWidget(Textarea);