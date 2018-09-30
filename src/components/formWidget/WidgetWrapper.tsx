import { Report } from "./Validator";
import * as React from "react";
import cm from './WidgetWrapper.scss';
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import ValidateReportor from "./ValidateReportor";

interface Props extends CSSAttrs {
    validateReport?: Report
}

const tools = Tools.getInstance();

export class WidgetWrapper extends React.PureComponent<Props> {
    render() {
        let { props } = this,
            { className, children, validateReport = { isValid: true, msg: '' } } = props;

        return (
            <div className={tools.classNames(cm.wrapper, className)}>
                <div className={cm['widget-control']} style={{
                    color: ValidateReportor.getFontColor(validateReport),
                }}>{ children }</div>
                {
                    <ValidateReportor {...validateReport} className={cm['msg-control']}></ValidateReportor>
                }
            </div>
        )
    }
}