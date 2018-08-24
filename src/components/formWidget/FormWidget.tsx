import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule } from "./Validator";

const tools = Tools.getInstance();
interface FormWidgetEvent {
    name: string;
    value: string;
    checked?: boolean;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent{}
export interface FormWidgetFocusEvent extends FormWidgetEvent {}
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
    checked?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    maxZhLength?: number;
    minZhLength?: number;
    rules?: Rule[];
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
            { onChange, name } = this.props;

        onChange && onChange({ 
            name: (name || '') as string, 
            value, checked,
        });
    }
    protected handleFocus(e?: any) {
        let { value, checked } = e.target, 
            { onFocus, name } = this.props;

        onFocus && onFocus({ 
            name: (name || '') as string, 
            value, checked,
        });
    }
    protected handleBlur(e?: any) {
        let { value, checked } = e.target, 
            { onBlur, name } = this.props;

        onBlur && onBlur({ 
            name: (name || '') as string, 
            value, checked,
        });
    }
}