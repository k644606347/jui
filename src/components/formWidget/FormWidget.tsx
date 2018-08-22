import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule } from "./Validator";

const tools = Tools.getInstance();
interface FormWidgetEvent {
    name?: string;
    value?: string;
    disabled?: boolean;
    checked?: boolean;
    eventType: string;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent{
    eventType: 'change'
}
export interface FormWidgetFocusEvent extends FormWidgetEvent {
    eventType: 'focus' | 'blur'
}
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    name?: string;
    value?: string;
    msg?: string;
    level?: MsgLevelType;
}
export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    maxZhLength?: number;
    minZhLength?: number;
    rules?: any[];
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e: FormWidgetFocusEvent) => void;
    onBlur?: (e: FormWidgetFocusEvent) => void;
    onAfterInit?: (...args: any[]) => void;
}
export interface FormWidgetState {}
export default abstract class FormWidget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    readonly state: S;
    constructor(props: P) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    abstract focus(): void;
    abstract blur(): void;
    protected handleChange(e?: any) {
        let { value, checked } = e.target, 
            { onChange, name, disabled } = this.props;

        onChange && onChange({ name, value, checked, disabled, eventType: 'change' });
    }
    protected handleFocus(e?: any) {
        let { value, disabled, checked } = e, 
            { onFocus, name } = this.props;

            onFocus && onFocus({ name, value, checked, disabled, eventType: 'focus' });
    }
    protected handleBlur(e?: any) {
        let { value, disabled, checked } = e, 
            { onBlur, name } = this.props;

            onBlur && onBlur({ name, value, checked, disabled, eventType: 'blur' });
    }
}