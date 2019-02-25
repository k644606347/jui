import { Report, validator } from "../../validate/Validator";
import * as React from "react";
import cm from './WidgetWrapper.scss';
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
interface Props extends CSSAttrs {
    validateReport?: Report
}

const tools = Tools.getInstance();

export class WidgetWrapper extends React.PureComponent<Props> {
    render() {
        let { props } = this,
            { className, children, validateReport = validator.getDefaultReport() } = props,
            { level = validator.getDefaultLevelBy(validateReport) } = validateReport;

        return (
            <div className={tools.classNames(cm.wrapper, className, cm[level])}>
                { children }
            </div>
        )
    }
}