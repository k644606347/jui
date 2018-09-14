
import * as React from 'react';
import cm from './Radio.scss';
import Tools from '../../utils/Tools';
import { iconCheck } from '../icons/FontAwesomeMap';
import Icon from '../Icon';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import wrapWidget from './wrapWidget';

const tools = Tools.getInstance();
export interface RadioProps extends FormWidgetProps { 
    checked?: boolean;
}
export interface RadioState extends FormWidgetState {
    checked?: boolean;
}
class Radio extends Widget<RadioProps, RadioState> {
    static defaultProps: Partial<RadioProps> = {
        name: '',
        value: '',
        checked: false,
        disabled: false,
    };
    getInitialState() {
        return {
            checked: this.props.checked,
        }
    }
    constructor(props: RadioProps) {
        super(props);
    }
    render() {
        let { disabled, readOnly, className, style, children, ...restProps } = this.props,
            { checked } = this.state,
            allowedInputElAttrs = this.getAllowedInputElAttrs(restProps);

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
                <input {...allowedInputElAttrs} className={cm.input} type="radio" checked={checked} disabled={!!(disabled || readOnly)} 
                    onChange={this.handleChange} 
                    onFocus={this.handleFocus} 
                    onBlur={this.handleBlur} 
                />
                <div className={cm.icon}><Icon icon={iconCheck} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </label>
        );
    }
    componentDidUpdate(prevProps: RadioProps, prevState: RadioState) {
        let { checked } = this.props;

        if (prevProps.checked !== checked) {
            this.setState({ checked });
        }
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked } = e.target,
            { name, onChange } = this.props;

        this.setState({ checked }, () => {
            onChange && onChange({ 
                name: name || '', 
                value,
                checked
            });
        });
    }
}
export default wrapWidget(Radio);