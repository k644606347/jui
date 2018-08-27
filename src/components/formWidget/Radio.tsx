
import * as React from 'react';
import cm from './Radio.scss';
import Tools from '../../utils/Tools';
import { iconCheck } from '../icons/FontAwesomeMap';
import Icon from '../Icon';
import FormWidget, { FormWidgetProps, FormWidgetState } from './FormWidget';
import wrapWidget from './wrapWidget';

const tools = Tools.getInstance();
export interface RadioProps extends FormWidgetProps { }
class Radio extends FormWidget<RadioProps, FormWidgetState> {
    static defaultProps: Partial<RadioProps> = {
        name: '',
        value: '',
        checked: false,
        disabled: false,
    };
    private readonly inputRef: React.RefObject<any>;
    constructor(props: RadioProps) {
        super(props);

        this.inputRef = React.createRef();
    }
    render() {
        let { checked, disabled, rules, className, style, children, onValid, onInvalid, isValid, validateMsg, validateMsgLevel, ...restProps } = this.props;

        // TODO icon风格需优化，细边框
        return (
            <label style={style} className={
                tools.classNames(
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    className)
            }>
                <input {...restProps} className={cm.input} type="radio" checked={checked} disabled={disabled} 
                    onChange={this.handleChange} 
                    onFocus={this.handleFocus} 
                    onBlur={this.handleBlur} 
                    ref={this.inputRef}
                />
                <div className={cm.icon}><Icon icon={iconCheck} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </label>
        );
    }
    focus() {
        this.inputRef.current.focus();
    }
    blur() {
        this.inputRef.current.blur();
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({ 
            name: name || '', 
            value: (checked ? value : ''), 
            checked 
        });
    }
}
export default wrapWidget<FormWidgetProps>(Radio);