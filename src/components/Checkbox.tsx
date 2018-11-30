import * as React from "react";
import Tools from "../utils/Tools";
import Icon from "./Icon";
import { CSSAttrs, Omit } from "../utils/types";
import cm from './Checkbox.scss';
import { iconCheckCircle, iconCheckCircleOutline } from "./icons/SVGData";

const tools = Tools.getInstance();

export interface CheckboxChangeEvent {
    id: string;
    name: string;
    value: any;
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
}
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (e: CheckboxChangeEvent) => void;
};
export interface CheckboxState {}

export default class Checkbox extends React.PureComponent<CheckboxProps, CheckboxState>{
    static defaultProps: Partial<CheckboxProps> = {
        checked: false,
    }
    getInitialState(props: CheckboxProps) {
        return {
            checked: props.checked,
        }
    }
    constructor(props: CheckboxProps) {
        super(props);

        this.state = this.getInitialState(props);
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { children, checked, disabled, readOnly, className, style, ...restProps } = this.props;

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
                <input {...restProps} className={cm.input} type="checkbox" 
                    checked={checked} disabled={disabled} readOnly={readOnly} 
                    onChange={this.handleChange}
                />
                <div className={cm.icon}><Icon icon={checked ? iconCheckCircle : iconCheckCircleOutline} /></div>
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
        let { value, checked, disabled, readOnly } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value,
            checked,
            disabled,
            readOnly
        });
    }
}