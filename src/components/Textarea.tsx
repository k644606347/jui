import * as React from "react";
import textareaCSS from './Textarea.scss';
import { tools } from "../utils/Tools";

let cssModules = tools.useCSS(textareaCSS);
class Textarea extends React.PureComponent<React.TextareaHTMLAttributes<HTMLTextAreaElement>> {
    render() {
        let { props } = this,
            {  className, children, ...restProps } = props;

        return (
            <textarea {...restProps} 
                className={tools.classNames(cssModules.wrapper, className)}>{ children }</textarea>
        );
    }
}

export default Textarea;