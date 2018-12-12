import * as React from "react";
import Tools from "../utils/Tools";
import Icon from "./Icon";
import { Omit } from "../utils/types";
import cm from './Checkbox.scss';
import { iconCheckCircle, iconCheckCircleOutline, IconDefinition, iconCheckSquare, iconCheckSquareOutline } from "./icons/SVGData";
import Label from "./Label";

const tools = Tools.getInstance();

export interface CheckboxChangeEvent {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    type: string;
}
type ThemeType = 'circle' | 'square';
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (e: CheckboxChangeEvent) => void;
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
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    readOnly && cm.readOnly,
                    className)
            }>
                <input {...restProps} className={cm.input} type="checkbox" 
                    checked={checked} disabled={disabled} readOnly={readOnly} 
                    onChange={this.handleChange}
                />
                <div className={cm.icon}><Icon icon={checked ? themeIcon.checked : themeIcon.unchecked} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </Label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked, disabled, readOnly } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value,
            checked,
            disabled,
            readOnly,
            type: 'checkbox',
        });
    }
}