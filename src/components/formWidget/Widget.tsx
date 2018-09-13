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
export interface FormWidgetFocusEvent { }
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    report: Report
}
type ValidateTrigger = 'onChange' | 'onBlur' | false;
const allowedInputElAttrs: Array<keyof React.InputHTMLAttributes<HTMLInputElement>> = [
    'id', 'name', 'value',  
    'disabled', 'readOnly', 'required', 
    'maxLength', 'minLength', 'placeholder', 
    'onChange', 'onFocus', 'onBlur'
];

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: any;
    focused?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    rules?: Rule[];
    validateTrigger?: ValidateTrigger;
    isValid?: boolean;
    validateMsg?: string;
    validateMsgLevel?: MsgLevelType;
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e?: FormWidgetFocusEvent) => void;
    onBlur?: (e?: FormWidgetFocusEvent) => void;
    // onAfterInit?: (...args: any[]) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
    __isFormField?: boolean;
}
export interface FormWidgetState {}
export default abstract class Widget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    state: S;
    getInitialState(props: P) {
        return {} as S;
    }
    constructor(props: P) {
        super(props);

        this.state = this.getInitialState(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validateReport = this.validateReport.bind(this);
    }
    protected handleChange(e?: any) {
        let { value } = e.target,
            { id, name, onChange } = this.props;

        onChange && onChange({
            id: id || '',
            name: name || '',
            value
        });
    }
    protected handleFocus(e?: any) {
        let { onFocus } = this.props;

        onFocus && onFocus();
    }
    protected handleBlur(e?: any) {
        let { onBlur } = this.props;

        onBlur && onBlur();
    }
    protected getAllowedInputElAttrs(obj: any = this.props) {
        let inputElAttrs = {};

        for (let key in obj) {
            let val = obj[key];
        
            if (allowedInputElAttrs.indexOf(key as any) !== -1) {
                inputElAttrs[key] = val;
            }
        }

        return inputElAttrs;
    }
    protected getRules() {
        let { required, maxLength, minLength, rules } = this.props,
            ruleMap = {
                required,
                maxLength,
                minLength,
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
        let promise = Validator.validate(value, this.getRules()),
            { name } = this.props;
            
        return promise.then(report => {
            if (name) {
                report.fieldName = name;
            }
            return report;
        });
    }
    protected validateReport(report: Report) {
        let { onValid, onInvalid } = this.props,
            { isValid } = report,
            event = {
                report
            };

        if (isValid) {
            onValid && onValid(event);
        } else {
            onInvalid && onInvalid(event);
        }
    }
}