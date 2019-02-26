import { Report, validator } from "../../validate/Validator";
import * as React from "react";
import css from './WidgetWrapper.scss';
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import View from "../View";
interface Props extends CSSAttrs {
    validateReport?: Report
}

const tools = Tools.getInstance();

export class WidgetWrapper extends View<Props> {
    cssObject = css;
    render() {
        let { props } = this,
            { className, children, validateReport = validator.getDefaultReport() } = props,
            { level = validator.getDefaultLevelBy(validateReport) } = validateReport,
            cssModules = this.cssModules;

        return (
            <div className={tools.classNames(cssModules.wrapper, className, cssModules[level])}>
                { children }
            </div>
        )
    }
}