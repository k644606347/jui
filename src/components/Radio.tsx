
import * as React from 'react';
import cm from './Radio.scss';
import Tools from '../utils/Tools';
import { iconCheck } from './icons/FontAwesomeMap';
import Icon from './Icon';
import { Omit } from '../utils/types';

const tools = Tools.getInstance();
export interface RadiioChangeEvent {
    id?: string;
    name?: string;
    value?: any;
    checked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (e: RadiioChangeEvent) => void;
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
                <div className={cm.icon}><Icon icon={iconCheck} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </label>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value: value,
            checked
        });
    }
}