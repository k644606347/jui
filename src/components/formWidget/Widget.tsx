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
    focused?: boolean;
    formWidgetEvent: boolean;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent {}
export interface FormWidgetMountEvent extends FormWidgetEvent {}
export interface FormWidgetFocusEvent extends FormWidgetEvent {}
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    report: Report
}
type ValidateTrigger = 'onChange' | 'onBlur';
const allowedInputElAttrs: Array<keyof React.InputHTMLAttributes<HTMLInputElement>> = [
    'id', 'name', 'disabled', 'readOnly', 'required', 
    'value',
    'maxLength', 'minLength', 'placeholder', 
    'onChange', 'onFocus', 'onBlur',
    'autoFocus',
];

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: any;
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
    onFocus?: (e: FormWidgetFocusEvent) => void;
    onBlur?: (e: FormWidgetFocusEvent) => void;
    onDidMount?: (e: FormWidgetMountEvent) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
}
export interface FormWidgetState {
    value: any;
    validateReport?: Report;
    focused: boolean;
}

const convertor = DataConvertor.getInstance();

export default abstract class Widget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    static dataType: DataType = 'string';
    state: S;
    getInitialState(props: P): S {
        return {
            // value: convertor.convertTo(props.defaultValue, this.getDataType()),
            validateReport: props.defaultValidateReport || Validator.getDefaultReport(),
            focused: !!props.autoFocus,
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
    getParsedValue() {
        return convertor.convertTo(this.props.value, this.getDataType());
    }
    componentDidMount() {
        let { onDidMount } = this.props;

        this.dispatchEvent(onDidMount);
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
        let { onFocus } = this.props,
            { focused } = this.state;

        this.setState({ focused: true }, () => {
            this.dispatchEvent(onFocus);
        });
    }
    protected handleChange(e?: any) {
        let { value } = e,
            { onChange } = this.props;

        // this.setValue(value).then(val => {
            this.dispatchEvent(onChange, { value });
        // });
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
    protected handleBlur(e?: any) {
        let { onBlur } = this.props;

        this.setState({ focused: false }, () => {
            this.dispatchEvent(onBlur);
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
    protected dispatchEvent(eventFunc: Function | undefined, params?: any) {
        eventFunc && eventFunc(this.buildEvent(params));
    }
    private buildEvent(rawEvent: any = {}): FormWidgetEvent {
        let { id = '', name = '', disabled = false, readOnly = false } = this.props,
            { focused } = this.state, 
            defaultEvent = {
                id,
                name,
                disabled,
                readOnly,
                focused,
                value: this.getParsedValue(),
                formWidgetEvent: true
            };

        return tools.isPlainObject(rawEvent) ? Object.assign(defaultEvent, rawEvent) : defaultEvent;
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
    validate(value: any = this.getParsedValue()): Promise<Report> {
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