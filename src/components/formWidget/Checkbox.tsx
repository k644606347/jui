import FormWidget, { FormWidgetState, FormWidgetProps } from "./FormWidget";
import * as React from "react";
import wrapWidget from "./wrapWidget";
import cm from './Checkbox.scss';
import Tools from "../../utils/Tools";
import Icon from "../Icon";
import { iconCheckCircle_r, iconCheckCircle, iconCircle_r } from "../icons/FontAwesomeMap";

const tools = Tools.getInstance();

interface Props extends FormWidgetProps {};
interface State extends FormWidgetState {};
class Checkbox extends FormWidget<Props, State>{
    static defaultProps: FormWidgetState = {
        checked: false
    }
    private readonly inputRef: React.RefObject<any>;
    constructor(props: Props) {
        super(props);

        this.inputRef = React.createRef();
    }
    render() {
        let { checked, disabled, className, style, children, onFocus, onBlur, ...restProps } = this.props;

        // TODO icon风格需优化，细边框
        return (
            <label style={style} className={
                tools.classNames(
                    cm.wrapper,
                    checked && cm.checked,
                    disabled && cm.disabled,
                    className)
            }>
                <input ref={this.inputRef} {...restProps} className={cm.input} type="checkbox" checked={checked} disabled={disabled} onChange={this.handleChange} />
                <div className={cm.icon}><Icon icon={disabled ? iconCheckCircle_r : checked ? iconCheckCircle : iconCircle_r} /></div>
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
}
export default wrapWidget<Props>(Checkbox);