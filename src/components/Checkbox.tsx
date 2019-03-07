import * as React from "react";
import { tools } from "../utils/Tools";
import Icon from "./Icon";
import checkboxCSS from './Checkbox.scss';
import { iconCheckCircle, iconCheckCircleOutline, IconDefinition, iconCheckSquare, iconCheckSquareOutline } from "./icons/SVGData";
import Label from "./Label";
import View from "./View";

let cssModules = tools.useCSS(checkboxCSS);

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
export default class Checkbox extends React.PureComponent<CheckboxProps>{
    static defaultProps = {
        checked: false,
        theme: "circle",
    }

    constructor(props: CheckboxProps) {
        super(props);

        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { children, checked, disabled, readOnly, className, style, theme, ...restProps } = this.props,
            themeIcon = themeIconMap[theme];

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
                <div className={cssModules.control}>
                    <Icon icon={checked ? themeIcon.checked : themeIcon.unchecked} className={cssModules.icon} />
                    {children !== undefined ? <span className={cssModules.description}>{children}</span> : ''}
                </div>
            </Label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { onChange } = this.props;
        onChange && onChange(e);
    }
}