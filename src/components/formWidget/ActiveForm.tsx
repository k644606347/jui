import * as React from "react";
import Tools from "../../utils/Tools";
import { ActiveFormContext } from "./ActiveFormContext";
import Validator, { Report, Rule } from "./Validator";
import { CSSAttrs, AnyFunction } from "../../utils/types";
import Form from "../Form";
import Log from "../../utils/Log";
import Widget, { FormWidgetChangeEvent, FormWidgetProps } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";

type ValueType = {[k in string]: any};
type ReportMap = {[k in string]: Report};
interface ValidateResult {isValid: boolean, reportMap: ReportMap}
export interface ActiveFormSubmitEvent {
    name: string;
    value: ValueType;
}
export interface ActiveFormChangeEvent {
    name: string;
    value: ValueType;
}

type FieldChangeEvent = React.ChangeEvent<any> | FormWidgetChangeEvent | CheckboxChangeEvent | RadioChangeEvent;
export interface ActiveFormRenderEvent {
    value: ValueType;
    handleChange: AnyFunction;
    handleSubmit: AnyFunction;
    isValid: boolean;
    submitting: boolean;
    validating: boolean;
}
export interface ActiveFormProps extends CSSAttrs {
    name?: string;
    initialValue?: ValueType;
    children?(e: ActiveFormRenderEvent): React.ReactNode;
    onSubmit?(e: ActiveFormSubmitEvent): void | Promise<any>;
    onChange?(e: ActiveFormChangeEvent): void;
    onValid?(): void;
    onInvalid?(): void;
    onValidating?(): void;
    onValidate?(): boolean;
    validateRules?: {[k in string]: Rule | Rule[]};
    validateOnChange: boolean;
    validateOnBlur?: boolean;
    // action: string;// TODO
    // method: 'post' | 'get';
    // acceptCharset?: string;
    // action?: string;
    // autoComplete?: string;
    // encType?: string;
    // method?: string;
    // noValidate?: boolean;
    // target?: string;
}
export interface ActiveFormState {
    value: ValueType;
    submitting: boolean;
    isValid: boolean;
    validating: boolean;
    validateReportMap: ReportMap;
}
const tools = Tools.getInstance();

export default class ActiveForm extends React.PureComponent<ActiveFormProps, ActiveFormState> {
    static defaultProps = {
        validateOnChange: false,
    };
    readonly state: ActiveFormState;
    private readonly widgets: Array<React.Component<FormWidgetProps> & Widget> = [];
    constructor(props: ActiveFormProps) {
        super(props);

        this.state = {
            submitting: false,
            value: this.getValueByProps(),
            isValid: true,
            validating: false,
            validateReportMap: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleValidating = this.handleValidating.bind(this);
        this.handleValid = this.handleValid.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleWidgetMount = this.handleWidgetMount.bind(this);
    }
    private getValueByProps() {
        let { initialValue } = this.props,
            result: ValueType = {};

        if (tools.isPlainObject(initialValue)) {
            for (let k in initialValue) {
                result[k] = initialValue[k];
            }
        }

        return result;
    }
    render() {
        let { props, state } = this,
            { name, children } = props,
            { value, validating, isValid, validateReportMap, submitting } = state,
            formProps = { name };

        let UnwrappedElement = <Form {...formProps}>
            {
                children ? 
                    children({
                        value, 
                        handleChange: this.handleFieldChange, 
                        handleSubmit: this.handleSubmit, 
                        isValid, 
                        validating,
                        submitting,
                    }) : ''
            }
        </Form>
        return (
            <ActiveFormContext.Provider value={{
                validating,
                isValid,
                validateReportMap,
                submitting,
                onWidgetMount: this.handleWidgetMount,
            }}>
                { UnwrappedElement }
            </ActiveFormContext.Provider>
        )
    }
    private handleWidgetMount(widgetInstance: any) {
        this.widgets.push(widgetInstance);
    }
    private setValueTimer: number;
    private setValueQueue: Array<{value: ValueType, resolve: AnyFunction}> = [];
    setValue(value: ValueType): Promise<{}> {
        let promise = new Promise((resolve, reject) => {
            if (tools.isPlainObject(value)) {
                this.setValueQueue.push({ value, resolve });
            } else {
                let errorMsg = `[ActiveForm.setValue]value必须是对象类型，当前是${JSON.stringify(value)}`;
                Log.error(errorMsg);
                reject(errorMsg);
            }
        });
        window.clearTimeout(this.setValueTimer);
        this.setValueTimer = window.setTimeout(() => {
            let nextValue = {...this.state.value};

            this.setValueQueue.forEach(info => {
                nextValue = Object.assign(nextValue, info.value);
            });
            this.setState({ value: nextValue }, () => {
                this.handleChange();
                this.setValueQueue.forEach(info => {
                    info.resolve();
                });
                this.setValueQueue = [];
            });
        }, 0);
        return promise;
    }
    getValue() {
        return this.state.value;
    }
    updateValidateResult({ isValid, reportMap }: ValidateResult) {
        let { validateReportMap } = this.state,
            nextValidateReportMap = {...validateReportMap},
            needRerender;

        if (isValid !== this.state.isValid) {
            needRerender = true;
        }

        for (let fieldName in reportMap) {
            let report = reportMap[fieldName],
                prevReport = validateReportMap[fieldName];

            if (!tools.isPlainObject(prevReport) || !Validator.compareReport(report, prevReport)) {
                needRerender = true;

                nextValidateReportMap[fieldName] = report;
            }
        }

        if (needRerender) {
            this.setState({ isValid, validateReportMap: nextValidateReportMap });
        }
    }
    runFieldValidate(fieldName: string) {
        let { validating } = this.state,
            { onValidating, onValid, onInvalid } = this.props;

        if (!validating) {
            this.setState({ validating: true });
            onValidating && onValidating();
        }
        this.validateField(fieldName)
            .then(report => {
                this.updateValidateResult({isValid: report.isValid, reportMap: { [fieldName]: report }});
                onValid && onValid();
            }).catch(report => {
                this.updateValidateResult({isValid: report.isValid, reportMap: { [fieldName]: report }});
                onInvalid && onInvalid();
            }).then(() => {
                this.setState({ validating: false });
            });
    }
    validate(): Promise<ValidateResult> {
        let isValid = true,
            reportMap: ReportMap = {},
            validCount = 0, invalidCount = 0;

        return new Promise((resolve: AnyFunction, reject: AnyFunction) => {
            let fieldNames = Object.keys(reportMap);

            fieldNames.forEach(fieldName => {
                this.validateField(fieldName)
                    .then((report: Report) => {
                        validCount ++;

                        if (report.fieldName)
                            reportMap[report.fieldName] = report;
                    }).catch((report: Report) => {
                        isValid = false;
                        invalidCount ++;
                        
                        if (report.fieldName)
                            reportMap[report.fieldName] = report;
                    }).then(() => {
                        if (validCount + invalidCount < fieldNames.length) {
                            return;
                        }
                        resolve({ isValid, reportMap });
                    });
            });
        });
    }
    validateField(fieldName: string): Promise<Report> {
        let { validateRules } = this.props,
            { value } = this.state,
            fieldValue = value[fieldName],
            fieldRules = validateRules && validateRules[fieldName];

        return new Promise((resolve, reject) => {
            if (!fieldRules) {
                resolve({isValid: true, fieldName, msg: ''});
                return;
            }

            if (!Array.isArray(fieldRules))
                fieldRules = [fieldRules];

            Validator.validate(fieldValue, fieldRules).then((report: Report) => {
                report.fieldName = fieldName;
                report.isValid ? resolve(report) : reject(report);
            }).catch((e: Error) => {
                reject({
                    fieldName,
                    msg: e.message,
                    isValid: false,
                    level: 'error'
                });
            })
        });
    }
    // TODO 当瞬间多次触发submit时改如何处理
    submit() {
        let { onSubmit, onValidating, onValid, onInvalid, name = '' } = this.props,
            { submitting, validating } = this.state;

        if (submitting === false) {
            this.setState({ submitting: true });
        }
        if (validating === false) {
            this.setState({ validating: true });
            onValidating && onValidating();
        }
        this.validate()
            .then(({ isValid, reportMap }) => {
                this.updateValidateResult({ isValid, reportMap });
                
                let setSubmitting = () => {
                    this.setState({ submitting: false });
                };

                if (!isValid) {
                    onInvalid && onInvalid();
                    setSubmitting();
                    return;
                } else {
                    onValid && onValid();
                }

                if (onSubmit) {
                    let result = onSubmit({name, value: this.getValue()});
                
                    if (result instanceof Promise) {
                        result.then(setSubmitting).catch(setSubmitting);
                    } else {
                        setSubmitting();
                    }
                } else {
                    setSubmitting();
                }
            });
    }
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.submit();
    }
    private fetchFieldInfoByChangeEvent(e: FieldChangeEvent) {
        let targetName: string,
            targetValue: any;

        if (isWidgetEvent(e)) {// widget event
            targetName = e.name;
            targetValue = e.value;
        } else if (isCheckboxOrRadioEvent(e)) {// checkbox and radio component event
            targetName = e.name;
            targetValue = e.checked;
        } else { // dom event
            let target = e.target;

            targetName = String(target.name);

            if (target.nodeName === 'INPUT' && (target.type === 'checkbox' || target.type === 'radio')) {
                targetValue = target.checked;
            } else {
                targetValue = target.value;
            }
        }

        function isWidgetEvent(event: any): event is FormWidgetChangeEvent {
            return event.type === 'widget';
        }
        function isRawEvent(event: any): event is React.ChangeEvent<any> {
            return !!event.target;
        }

        function isCheckboxOrRadioEvent(event: any): event is CheckboxChangeEvent | RadioChangeEvent {
            return event.type === 'checkbox' || event.type === 'radio';
        }

        return {
            name: targetName,
            value: targetValue,
        };
    }
    private handleFieldChange(e: FieldChangeEvent) {
        let { validateOnChange } = this.props,
            { name, value } = this.fetchFieldInfoByChangeEvent(e),
            prevValue = this.getValue()[name];

        if (prevValue !== value) {
            this.setValue({[name]: value}).then(() => {
                validateOnChange && this.runFieldValidate(name);
            });
        }
    }
    private handleFieldBlur() {
        // TODO   
    }
    handleValid() {
        this.props.onValid && this.props.onValid();
    }
    handleInvalid() {
        this.props.onInvalid && this.props.onInvalid();
    }
    handleValidating() {
        this.props.onValidating && this.props.onValidating();
    }
    private handleChange() {
        let { name = '', onChange } = this.props,
            { value } = this.state;

        onChange && onChange({ name, value });
    }
}