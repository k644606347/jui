import * as React from "react";
import Message from "../Message";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import { ActiveFormContextType } from "./ActiveFormContext";
import connectActiveForm from "./connectActiveForm";
import messageCSS from './ValidateMessage.scss';

interface Props extends CSSAttrs {
    fieldName: string;
    popover: boolean;
    activeFormContext?: ActiveFormContextType;
}

const tools = Tools.getInstance();
// const fontColorMap = {
//     error: '#f5222d',
//     warn: '#faad14',
// };
class ValidateMessage extends React.PureComponent<Props> {
    static defaultProps = {
        popover: false,
    }
    // static getFontColor(validateReport: Report | undefined) {
    //     if (!validateReport || validateReport.isValid) {
    //         return '';
    //     }

    //     let { level = '' } = validateReport;

    //     return fontColorMap[level];
    // }
    render() {
        let { props } = this,
            { fieldName, className, style, popover, activeFormContext } = props,
            fieldValidateReport;
        
        if (activeFormContext && activeFormContext.validateReportMap) {
            let { validateReportMap } = activeFormContext;

            fieldValidateReport = validateReportMap[fieldName];
        }
        if (!tools.isPlainObject(fieldValidateReport)) {
            return '';
        }

        let { level, isValid, msg } = fieldValidateReport;

        if (isValid || msg === '') {
            return '';
        }

        let MessageTag = <Message style={style} 
                            className={tools.classNames(messageCSS.msg, level && messageCSS[level], className)}
                            type={level} showIcon={false}>{msg}</Message>;
        
                    
        return (
            <React.Fragment>
                {
                    popover ? 
                        <div className={popover && messageCSS.popover}>
                            { MessageTag }
                        </div> : 
                        MessageTag
                }
            </React.Fragment>
        )
    }
}

export default connectActiveForm<typeof ValidateMessage, Props>(ValidateMessage);