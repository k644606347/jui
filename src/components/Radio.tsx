
import * as React from 'react';
import Tools from '../utils/Tools';
import Icon from './Icon';
import { Omit } from '../utils/types';
import cm from './Radio.scss';
import { iconRadioBtnOn, iconRadioBtnOff, IconDefinition, iconCheck } from './icons/SVGData';
import Label from './Label';

const tools = Tools.getInstance();
export interface RadioChangeEvent {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    component: string;
}
type ThemeType = 'circle' | 'checkmark';
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    theme?: ThemeType;
    onChange?: (e: RadioChangeEvent) => void;
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
            themeIcon = themeIconMap[theme!];

        return (
            <Label style={style} className={
                tools.classNames(
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    readOnly && cm.readOnly,
                    cm['theme-' + theme],
                    className
                )
            }>
                <input {...restProps} 
                    className={cm.input} 
                    type="radio" checked={checked} disabled={disabled} readOnly={readOnly}
                    onChange={this.handleChange} 
                />
                <div className={cm.icon}><Icon icon={checked ? themeIcon.checked : themeIcon.unchecked} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </Label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked, readOnly, disabled } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value,
            checked,
            readOnly,
            disabled,
            component: 'radio',
        });
    }
}