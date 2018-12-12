import * as React from "react";
import { CSSAttrs, AnyPlainObject } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
import DataConvertor, { DataType } from "./stores/DataConvertor";

const tools = Tools.getInstance();

type ValueType = number | string | boolean | object;
interface FormWidgetEvent {
    id: string;
    name: string;
    value: ValueType;
    disabled: boolean;
    readOnly: boolean;
    focused: boolean;
    type: string;
    widgetName: string;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent {}
export interface FormWidgetMountEvent extends FormWidgetEvent {}
export interface FormWidgetFocusEvent extends FormWidgetEvent {}
export interface FormWidgetKeyboardEvent extends FormWidgetEvent {}

export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent extends FormWidgetEvent {
    report: Report
}
type ValidateTrigger = 'onChange' | 'onBlur';

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: ValueType;
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
    onKeyDown?(e: FormWidgetKeyboardEvent): void;
    onKeyUp?(e: FormWidgetKeyboardEvent): void;
    onKeyPress?(e: FormWidgetKeyboardEvent): void;
    onDidMount?: (e: FormWidgetMountEvent) => void;
    onValidating?: (e: FormWidgetValidEvent) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
}
export interface FormWidgetState {
    focused: boolean;
    validating: boolean;
}
export default abstract class Widget<P extends FormWidgetProps = FormWidgetProps, S extends FormWidgetState = FormWidgetState> extends React.PureComponent<P, S> {
    static convertor = DataConvertor.getInstance();
    state: S;
    protected abstract dataType: DataType;
    protected abstract widgetName = 'widget';
    getInitialState(props: P): S {
        return {
            focused: !!props.autoFocus,
            validating: false,
        } as S;
    }
    constructor(props: P) {
        super(props);

        this.state = this.getInitialState(props);

        this.initChangeHandler();
        this.handleFocus = this.handleFocus.bind(this);
        this.initBlurHandler();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp =  this.handleKeyPress.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.validateReport = this.validateReport.bind(this);
    }
    componentDidMount() {
        let { onDidMount } = this.props;

        onDidMount && onDidMount(this.buildEvent());
    }
    getParsedValue() {
        return this.parseValue();
    }
    parseValue(value: any = this.props.value) {
        return this.getDataConvertor().convertTo(value, this.getDataType())
    }
    getDataConvertor() {
        return this.getClass().convertor;
    }
    getWidgetName() {
        return this.getClass().widgetName;
    }
    getDataType() {
        return this.dataType;
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
    protected handleFocus(e: React.FocusEvent) {
        let { onFocus } = this.props;

        this.setState({ focused: true }, () => {
            onFocus && onFocus(this.buildEvent());
        });
    }
    protected abstract handleChange(e: any): void;
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
    protected handleBlur(e: React.FocusEvent) {
        let { onBlur } = this.props;

        this.setState({ focused: false }, () => {
            onBlur && onBlur(this.buildEvent());
        });
    }
    protected handleKeyDown(e: React.KeyboardEvent) {
        let { onKeyDown } = this.props;

        onKeyDown && onKeyDown(this.buildEvent());
    }
    protected handleKeyUp(e: React.KeyboardEvent) {
        let { onKeyUp } = this.props;

        onKeyUp && onKeyUp(this.buildEvent());
    }
    protected handleKeyPress(e: React.KeyboardEvent) {
        let { onKeyPress } = this.props;

        onKeyPress && onKeyPress(this.buildEvent());
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
    protected buildEvent(rawEvent: AnyPlainObject = {}): any {
        let { id = '', name = '', disabled = false, readOnly = false, value = this.getParsedValue() } = this.props,
            { focused } = this.state, 
            defaultEvent: FormWidgetEvent = {
                id,
                name,
                value,
                disabled,
                readOnly,
                focused,
                type: 'widget',
                widgetName: this.getWidgetName(),
            };

        return tools.isPlainObject(rawEvent) ? Object.assign(defaultEvent, rawEvent) : defaultEvent;
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
    private validateTimer: number = 0;
    private dispatchValidation() {
        window.clearTimeout(this.validateTimer);
        this.validateTimer = window.setTimeout(() => {
            this.validate();
        }, 200);
    }
    // TODO 当一个方法中存在多处validate调用时，如何处理已过期的返回结果？reject还是resolve？
    validate(value: ValueType = this.getParsedValue()): Promise<Report> {
        let promise = this.validatePromise = Validator.validate(value, this.getRules()),
            { onValidating } = this.props,
            { validating } = this.state,
            { name = '' } = this.props;
            
        if (validating === false) {
            onValidating && onValidating(this.buildEvent());
        }

        return new Promise((resolve, reject) => {
            promise.then((report: Report) => {
                report.fieldName = name;
                
                if (this.validatePromise !== promise) {
                    resolve(report);
                }

                this.setState({ validating: false }, () => {
                    this.validateReport(report);
                    resolve(report);
                });
            });
        });
    }
    validateReport(report: Report) {
        let { onValid, onInvalid } = this.props,
            { isValid } = report,
            event = this.buildEvent({
                report
            });

        if (isValid) {
            onValid && onValid(event);
        } else {
            onInvalid && onInvalid(event);
        }
    }
}