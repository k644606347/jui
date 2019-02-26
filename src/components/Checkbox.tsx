import * as React from "react";
import Tools, { tools } from "../utils/Tools";
import Icon from "./Icon";
import { Omit } from "../utils/types";
import checkboxCSS from './Checkbox.scss';
import { iconCheckCircle, iconCheckCircleOutline, IconDefinition, iconCheckSquare, iconCheckSquareOutline } from "./icons/SVGData";
import Label from "./Label";
import View from "./View";

type ThemeType = 'circle' | 'square';
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    theme: ThemeType;
};
export interface CheckboxState {}

const themeIconMap: {[k in ThemeType]: {checked: IconDefinition, unchecked: IconDefinition}} = {
    circle: {
        checked: iconCheckCircle,
        unchecked: iconCheckCircleOutline,
    },
    square: {
        checked: iconCheckSquare,
        unchecked: iconCheckSquareOutline,
    }
}
export default class Checkbox extends View<CheckboxProps>{
    static defaultProps = {
        checked: false,
        theme: "circle",
    }
    cssObject = checkboxCSS;
    constructor(props: CheckboxProps) {
        super(props);

        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { children, checked, disabled, readOnly, className, style, theme, ...restProps } = this.props,
            themeIcon = themeIconMap[theme],
            cssModules = this.cssModules;

        return (
            <Label style={style} className={
                tools.classNames(
                    cssModules.wrapper,
                    checked && cssModules.checked,
                    disabled && cssModules.disabled,
                    readOnly && cssModules.readOnly,
                    className)
            }>
                <input {...restProps} className={cssModules.input} type="checkbox" 
                    checked={checked} disabled={disabled} readOnly={readOnly} 
                    onChange={this.handleChange}
                />
                <div className={cssModules.icon}><Icon icon={checked ? themeIcon.checked : themeIcon.unchecked} /></div>
                {children !== undefined ? <div className={cssModules.description}>{children}</div> : ''}
            </Label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { onChange } = this.props;
        onChange && onChange(e);
    }
}