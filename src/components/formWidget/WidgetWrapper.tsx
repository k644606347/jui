import { Report, validator } from "../../validate/Validator";
import * as React from "react";
import css from './WidgetWrapper.scss';
import { CSSAttrs } from "../../utils/types";
import View from "../View";
import { tools } from "../../utils/Tools";

let cssModules = tools.useCSS(css);
interface Props extends CSSAttrs {
    validateReport?: Report
}

export class WidgetWrapper extends React.PureComponent<Props> {
    cssObject = css;
    render() {
        let { props } = this,
            { className, children, validateReport = validator.getDefaultReport() } = props,
            { level = validator.getDefaultLevelBy(validateReport) } = validateReport;

        return (
            <div className={tools.classNames(cssModules.wrapper, className, cssModules[level])}>
                { children }
            </div>
        )
    }
}