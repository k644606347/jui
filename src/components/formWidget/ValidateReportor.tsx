import * as React from "react";
import { Report } from "./Validator";
import Message from "../Message";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import cm from './ValidateReportor.scss';
interface Props extends CSSAttrs, Report {
    popover?: boolean;
}

const tools = Tools.getInstance();
const fontColorMap = {
    error: '#f5222d',
    warn: '#faad14',
};
export default class ValidateReportor extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        popover: true,
    }
    static getFontColor(validateReport: Report | undefined) {
        if (!validateReport || validateReport.isValid) {
            return '';
        }

        let { level = '' } = validateReport;

        return fontColorMap[level];
    }
    render() {
        let { props } = this,
            { className, style, isValid, msg, level = 'error', popover } = props,
            MessageTag = <Message style={style} className={tools.classNames(cm.msg, isValid && cm.isValid, className)}
                            type={level} showIcon={false}>{msg}</Message>;
        
        return (
            popover ? 
                <div className={popover && cm.popover}>
                    { MessageTag }
                </div> : 
                MessageTag
        )
    }
}