
import * as React from 'react';
import Tools, { tools } from '../utils/Tools';
import Icon from './Icon';
import { Omit } from '../utils/types';
import radioCSS from './Radio.scss';
import { iconRadioBtnOn, iconRadioBtnOff, IconDefinition, iconCheck } from './icons/SVGData';
import Label from './Label';

let cssModules = tools.useCSS(radioCSS);

type ThemeType = 'circle' | 'checkmark';
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    theme?: ThemeType;
};
export interface RadioState {}

const themeIconMap: {[k in ThemeType]: {
    checked: IconDefinition,
    unchecked: IconDefinition,
}} = {
    circle: {
        checked: iconRadioBtnOn,
        unchecked: iconRadioBtnOff,
    },
    checkmark: {
        checked: iconCheck,
        unchecked: iconCheck,
    }
}
export default class Radio extends React.PureComponent<RadioProps> {
    static defaultProps = {
        name: '',
        value: '',
        checked: false,
        disabled: false,
        theme: 'circle',
    };

    constructor(props: RadioProps) {
        super(props);

        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { disabled, checked, readOnly, className, style, children, theme, ...restProps } = this.props,
            themeIcon = theme && themeIconMap[theme];

        return (
            <Label style={style} className={
                tools.classNames(
                    cssModules.wrapper,
                    checked && cssModules.checked,
                    disabled && cssModules.disabled,
                    readOnly && cssModules.readOnly,
                    cssModules['theme-' + theme],
                    className
                )
            }>
                <input {...restProps} 
                    className={cssModules.input} 
                    type="radio" checked={checked} disabled={disabled} readOnly={readOnly}
                    onChange={this.handleChange} 
                />
                <div className={cssModules.icon}>{ themeIcon ? <Icon icon={checked ? themeIcon.checked : themeIcon.unchecked} /> : '' }</div>
                {children !== undefined ? <div className={cssModules.description}>{children}</div> : ''}
            </Label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { onChange } = this.props;
        onChange && onChange(e);
    }
}