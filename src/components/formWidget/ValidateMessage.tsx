import * as React from "react";
import Message from "../Message";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import { ActiveFormContextType } from "./ActiveFormContext";
import connectActiveForm from "./connectActiveForm";
import messageCSS from './ValidateMessage.scss';
import { validator, Report } from "../../validate/Validator";

interface Props extends CSSAttrs {
    fieldName: string;
    popover: boolean;
    activeFormContext?: ActiveFormContextType;
}

const tools = Tools.getInstance();
class ValidateMessage extends React.PureComponent<Props> {
    static defaultProps = {
        popover: false,
    }
    render() {
        let { props } = this,
            { fieldName, className, style, popover, activeFormContext } = props,
            fieldReport: Report = validator.getDefaultReport();
        
        if (activeFormContext && activeFormContext.fieldReportMap) {
            let { fieldReportMap } = activeFormContext;

            if (validator.isValidReport(fieldReportMap[fieldName]))
                fieldReport = fieldReportMap[fieldName];
        }

        let { level, msg } = fieldReport;
        
        if (!msg) {
            return '';
        }

        if (!level)
            level = validator.getDefaultLevel();

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