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
            { className, style, isValid, msg, level = 'error' } = props;
        
            // TODO popover mode
        return msg && !isValid ? 
                <div style={style} className={tools.classNames(cm.wrapper, cm.popover, className)}>
                    <Message className={cm.msg} type={level} showIcon={false}>{msg}</Message>
                </div> : '';
    }
}