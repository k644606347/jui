import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
import DataConvertor, { DataType } from "./stores/DataConvertor";

const tools = Tools.getInstance();
interface FormWidgetEvent {
    id?: string;
    name?: string;
    value?: any;
    disabled?: boolean;
    readOnly?: boolean;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent {}
export interface FormWidgetMountEvent extends FormWidgetEvent {}
export interface FormWidgetFocusEvent {}
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    report: Report
}
type ValidateTrigger = 'onChange' | 'onBlur';
const allowedInputElAttrs: Array<keyof React.InputHTMLAttributes<HTMLInputElement>> = [
    'id', 'name', 'disabled', 'readOnly', 'required', 
    'maxLength', 'minLength', 'placeholder', 
    'onChange', 'onFocus', 'onBlur',
    'autoFocus',
];

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    defaultValue?: any;
    defaultValidateReport?: Report;
    autoFocus?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    rules?: Rule[];
    validateTrigger?: ValidateTrigger[] | ValidateTrigger;
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e?: FormWidgetFocusEvent) => void;
    onBlur?: (e?: FormWidgetFocusEvent) => void;
    onDidMount?: (...args: any[]) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
}
export interface FormWidgetState {
    value: any;
    validateReport?: Report;
}

const convertor = DataConvertor.getInstance();

export default abstract class Widget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    static dataType: DataType = 'string';
    state: S;
    getInitialState(props: P): S {
        return {
            value: convertor.convertTo(props.defaultValue, this.getDataType()),
            validateReport: props.defaultValidateReport || { isValid: true },
        } as S;
    }
    constructor(props: P) {
        super(props);

        this.state = this.getInitialState(props);

        this.initChangeHandler();
        this.handleFocus = this.handleFocus.bind(this);
        this.initBlurHandler();
        this.validateReport = this.validateReport.bind(this);
    }
    setValue(value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setState(
                { value: convertor.convertTo(value, this.getDataType()) },
                resolve.bind(this, this.state.value)
            );
        })
    }
    getValue() {
        return this.state.value;
    }
    componentDidMount() {
        let { onDidMount } = this.props;

        onDidMount && onDidMount();
    }
    getDataType(): DataType {
        return this.getClass().dataType;
    }
    getClass(): any {
        return this.constructor;
    }
    isDisabled() {
        return !!this.props.disabled;
    }
    isReadOnly() {
        return !!this.props.readOnly;
    }
    getValidateTriggers() {
        let { validateTrigger } = this.props;

        return tools.isArray(validateTrigger) ? validateTrigger : 
                tools.isString(validateTrigger) ? [validateTrigger] : ['onChange'];
    }
    protected handleFocus(e?: any) {
        let { onFocus } = this.props;

        onFocus && onFocus();
    }
    protected initChangeHandler() {
        let handler = this.handleChange.bind(this),
            proxyHandler = (...args: any[]) => {
            if (this.isDisabled() || this.isReadOnly()) {
                return;
            }

            handler(...args);
    
            if (this.getValidateTriggers().indexOf('onChange') !== -1)
                this.dispatchValidation();
        }
        this.handleChange = proxyHandler.bind(this);
    }
    protected handleChange(e?: any) {
        let { value } = e,
            { id, name, onChange } = this.props;

        this.setValue(value).then(val => {
            onChange && onChange({
                id: id || '',
                name: name || '',
                value: val,
            });
        });
    }
    protected initBlurHandler() {
        let handler = this.handleBlur.bind(this),
            proxyHandler = (...args: any[]) => {
                handler(...args);

                if (this.getValidateTriggers().indexOf('onBlur') !== -1)
                    this.dispatchValidation();        
            }
        this.handleBlur = proxyHandler.bind(this);
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
    private validatePromise: Promise<any>;
    private validateTimer: number;
    private dispatchValidation() {
        window.clearTimeout(this.validateTimer);
        this.validateTimer = window.setTimeout(() => {
            let promise: Promise<any> = this.validatePromise = this.validate()
                .then((report: Report) => {
                    if (this.validatePromise === promise) {
                        this.validateReport(report);
                    }
                });
        }, 100);
    }
    validate(value: any = this.getValue()): Promise<Report> {
        let promise = Validator.validate(value, this.getRules()),
            { name } = this.props;
            
        return promise.then(report => {
            if (name) {
                report.fieldName = name;
            }
            return report;
        });
    }
    validateReport(report: Report) {
        let { onValid, onInvalid } = this.props,
            { isValid } = report,
            event = {
                report
            };

        this.setState({ validateReport: report });
        if (isValid) {
            onValid && onValid(event);
        } else {
            onInvalid && onInvalid(event);
        }
    }
}