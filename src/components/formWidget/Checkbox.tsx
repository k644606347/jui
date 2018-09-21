import Widget, { FormWidgetState, FormWidgetProps } from "./Widget";
import * as React from "react";
import cm from './Checkbox.scss';
import Tools from "../../utils/Tools";
import Icon from "../Icon";
import { iconCheckCircle, iconCircle_r } from "../icons/FontAwesomeMap";
import wrapWidget from "./wrapWidget";

const tools = Tools.getInstance();

export interface CheckboxProps extends FormWidgetProps {
    checked?: boolean;
};
export interface CheckboxState extends FormWidgetState {
    checked?: boolean;
}
class Checkbox extends Widget<CheckboxProps, CheckboxState>{
    static defaultProps: Partial<CheckboxProps> = {
        checked: false,
    }
    getInitialState(props: CheckboxProps) {
        return {
            ...super.getInitialState(props),
            checked: props.checked,
        }
    }
    constructor(props: CheckboxProps) {
        super(props);
    }
    render() {
        let { children, disabled, readOnly, className, style, ...restProps } = this.props,
        { checked } = this.state,
        value = this.getValue(),
        allowedInputElAttrs = this.getAllowedInputElAttrs(restProps);

        // TODO icon风格需优化，细边框
        return (
            <label style={style} className={
                tools.classNames(
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    readOnly && cm.readOnly,
                    className)
            }>
                <input {...allowedInputElAttrs} value={value} className={cm.input} type="checkbox" 
                    checked={checked} disabled={!!(disabled || readOnly)}
                    onChange={this.handleChange} 
                    onFocus={this.handleFocus} 
                    onBlur={this.handleBlur}
                />
                <div className={cm.icon}><Icon icon={checked ? iconCheckCircle : iconCircle_r} /></div>
                {children !== undefined ? <div className={cm.description}>{children}</div> : ''}
            </label>
        );
    }
    componentDidUpdate(prevProps: CheckboxProps, prevState: CheckboxState) {
        let { checked } = this.props;

        if (prevProps.checked !== checked) {
            this.setState({ checked });
        }
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value, checked } = e.target,
            { id, name, onChange } = this.props;

        this.setState({ checked }, () => {
            onChange && onChange({
                id: id || '',
                name: name || '',
                value: value,
                checked
            });
        });
    }
}
export default wrapWidget(Checkbox);