
import * as React from 'react';
import Tools from '../utils/Tools';
import Icon from './Icon';
import { Omit } from '../utils/types';
import cm from './Radio.scss';
import { iconRadioBtnOn, iconRadioBtnOff } from './icons/SVGData';

const tools = Tools.getInstance();
export interface RadioChangeEvent {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    type: string;
}
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (e: RadioChangeEvent) => void;
};
export interface RadioState {}

export default class Radio extends React.PureComponent<RadioProps, RadioState> {
    static defaultProps: Partial<RadioProps> = {
        name: '',
        value: '',
        checked: false,
        disabled: false,
    };
    getInitialState(props: RadioProps) {
        return {};
    }
    constructor(props: RadioProps) {
        super(props);

        this.state = this.getInitialState(props);
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { disabled, checked, readOnly, className, style, children, ...restProps } = this.props;

        // TODO icon风格需优化，细边框
        return (
            <label style={style} className={
                tools.classNames(
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    readOnly && cm.readOnly,
                    className
                )
            }>
                <input {...restProps} 
                    className={cm.input} 
                    type="radio" checked={checked} disabled={disabled} readOnly={readOnly}
                    onChange={this.handleChange} 
                />
                <div className={cm.icon}><Icon icon={checked ? iconRadioBtnOn : iconRadioBtnOff} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </label>
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
            type: 'radio',
        });
    }
}