import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";

const tools = Tools.getInstance();
interface FormWidgetEvent {
    id?: string;
    name?: string;
    value?: any;
    checked?: boolean;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent { }
export interface FormWidgetFocusEvent extends FormWidgetEvent { }
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    name?: string;
    value?: any;
    msg?: string;
    level?: MsgLevelType;
}
export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: any;
    defaultValue?: any;
    checked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    maxZhLength?: number;
    minZhLength?: number;
    rules?: Rule[];
    isValid?: boolean;
    validateMsg?: string;
    validateMsgLevel?: MsgLevelType;
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e: FormWidgetFocusEvent) => void;
    onBlur?: (e: FormWidgetFocusEvent) => void;
    // onAfterInit?: (...args: any[]) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
}
export interface FormWidgetState { }
export default abstract class FormWidget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    readonly state: S;
    constructor(props: P) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validateReport = this.validateReport.bind(this);
    }
    protected handleChange(e?: any) {
        let { value, checked } = e.target,
            { id, name, onChange } = this.props;


        onChange && onChange({
            id: id || '',
            name: name || '',
            value, checked,
        });
    }
    protected handleFocus(e?: any) {
        let { value, checked } = e.target,
            { id, name, onFocus } = this.props;

        onFocus && onFocus({
            id: id || '',
            name: name || '',
            value, checked,
        });
    }
    protected handleBlur(e?: any) {
        let { value, checked } = e.target,
            { id, name, onBlur } = this.props;

        onBlur && onBlur({
            id: id || '',
            name: name || '',
            value, checked,
        });
    }
    abstract focus(): void;
    abstract blur(): void;
    protected getRules() {
        let { required, maxLength, minLength, maxZhLength, minZhLength, rules } = this.props,
            ruleMap = {
                required,
                maxLength,
                minLength,
                maxZhLength,
                minZhLength,
            },
            mixedRules: Rule[] = [];

        Object.keys(ruleMap).forEach(k => {
            let val = ruleMap[k];
            val !== undefined && mixedRules.push({
                rule: k,
                value: ruleMap[k],
            });
        });
        Object.assign(mixedRules, rules);

        return mixedRules;
    }
    async validate(value: any = this.props.value): Promise<Report> {
        return Validator.validate(value, this.getRules());
    }
    protected validateReport(result: Report) {
        let { onValid, onInvalid } = this.props,
            { value, isValid, msg, hitRule, level } = result;

        let event = {
            value, hitRule, level, msg,
        };
        if (isValid) {
            onValid && onValid(event);
        } else {
            onInvalid && onInvalid(event);
        }
    }
}