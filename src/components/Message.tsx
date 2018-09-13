import * as React from "react";
import { CSSAttrs } from "../utils/types";
import Tools from "../utils/Tools";
import cm from './LogView.scss';

interface Props extends CSSAttrs {
    type: 'error' | 'warn' | 'info'
}

const tools = Tools.getInstance();
export default class LogView extends React.PureComponent<Props, any> {
    render() {
        let { type, children, style, className } = this.props;

        return (
            <div style={style} className={
                tools.classNames(
                    cm.wrapper,
                    cm[type],
                    className,
                )
            }>
                {
                    children
                }
            </div>
        )
    }
}
