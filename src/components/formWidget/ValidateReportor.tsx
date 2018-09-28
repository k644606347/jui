import * as React from "react";
import { Report } from "./Validator";
import Message from "../Message";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";

interface Props extends CSSAttrs, Report {}

const tools = Tools.getInstance();

export default class ValidateReportor extends React.PureComponent<Props> {
    render() {
        let { props } = this,
            { className, style, children, isValid, msg, level = 'error' } = props;
        
        return <div className={tools.classNames(className)} style={style}>
            {children}
            {
                !isValid ? <Message showIcon={false} type={level}>{msg}</Message> : ''
            }
        </div>
    }
}