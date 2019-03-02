import * as React from "react";
import Message from "../Message";
import { CSSAttrs } from "../../utils/types";
import { tools } from "../../utils/Tools";
import { ActiveFormContextType } from "./ActiveFormContext";
import connectActiveForm from "./connectActiveForm";
import messageCSS from './ValidateMessage.scss';
import { validator, Report } from "../../validate/Validator";
import View from "../View";

let cssModules = tools.useCSS(messageCSS);
interface Props extends CSSAttrs {
    fieldName: string;
    popover: boolean;
    activeFormContext?: ActiveFormContextType;
}

class ValidateMessage extends React.PureComponent<Props> {
    static defaultProps = {
        popover: false,
    }
    cssObject = messageCSS;
    render() {
        let { props } = this,
            { fieldName, className, style, popover, activeFormContext } = props,
            fieldReport: Report = validator.getDefaultReport();
        
        if (activeFormContext && activeFormContext.fieldReportMap) {
            let { fieldReportMap } = activeFormContext;

            if (validator.isValidReport(fieldReportMap[fieldName]))
                fieldReport = fieldReportMap[fieldName];
        }

        let { isValid, level, msg } = fieldReport;
        
        console.log('ValidateMessage.render');
        if (!msg) {
            return '';
        }

        if (!level)
            level = validator.getDefaultLevelBy(isValid);

        let MessageTag = <Message style={style} 
                            className={tools.classNames(cssModules.msg, level && cssModules[level], className)}
                            type={level} showIcon={false}>{msg}</Message>;
        
                    
        return (
            <React.Fragment>
                {
                    popover ? 
                        <div className={popover && cssModules.popover}>
                            { MessageTag }
                        </div> : 
                        MessageTag
                }
            </React.Fragment>
        )
    }
}

export default connectActiveForm<typeof ValidateMessage, Props>(ValidateMessage);