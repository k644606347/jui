import * as React from "react";
import labelCSS from './Label.scss';
import { tools } from "../utils/Tools";
import View from "./View";

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
    onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
    required?: boolean;
}

export default class Label extends View<LabelProps> {
    static isLabelElement(el: any): el is React.ReactElement<LabelProps> {
        return React.isValidElement(el) && el.type === Label;
    }
    cssObject = labelCSS;
    constructor(props: LabelProps) {
        super(props);

        this.handleLabelClick = this.handleLabelClick.bind(this);
    }
    render() {
        let { required, children, className, onClick, ...restProps } = this.props,
            cssModules = this.getCSSModules();

        return (
            <label {...restProps} className={
                tools.classNames(cssModules.wrapper, required && cssModules.required, className)
            } onClick={this.handleLabelClick}>{children}</label>
        )
    }
    handleLabelClick(e: React.MouseEvent<HTMLLabelElement>) {
        let { onClick } = this.props;
        onClick && onClick(e);
    }
}
