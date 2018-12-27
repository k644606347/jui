import * as React from "react";
import Tools from "../../utils/Tools";
import { ActiveFormContext } from "./ActiveFormContext";
import Validator, { Report, Rule } from "./Validator";
import { CSSAttrs, AnyFunction, AnyPlainObject } from "../../utils/types";
import Form from "../Form";
import Log from "../../utils/Log";
import Widget, { FormWidgetChangeEvent, FormWidgetProps } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";
import { FieldChangeEvent } from "./Field";
import { Toast } from "../..";

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

export interface ActiveFormRenderEvent extends ActiveFormState{
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
    // onChange?(e: ActiveFormChangeEvent): void;
    onValid?(): void;
    onInvalid?(): void;
    onValidating?(): void;
    onValidate?(value: ValueType): Promise<Report> | Report;
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

const THROTTLE_VALIDATE_DELAY = 300;
export default class ActiveForm extends React.PureComponent<ActiveFormProps, ActiveFormState> {
    static defaultProps = {
        validateOnChange: false,
    };
    readonly state: ActiveFormState;
    private readonly fields: React.ReactInstance[] = [];
    private readonly widgets: Array<React.Component<FormWidgetProps> & Widget> = [];
    constructor(props: ActiveFormProps) {
        super(props);

        this.state = {
            value: {},
            isValid: true,
            submitting: false,
            validating: false,
            validateReportMap: {}
        };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidating = this.handleValidating.bind(this);
        this.handleValid = this.handleValid.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleFieldMount = this.handleFieldMount.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
    }
    render() {
        let { props, state } = this,
            { name, children } = props,
            { validating, isValid, validateReportMap, submitting } = state,
            formProps = { name };

        // console.log('ActiveForm rerender');
        console.log(this.state);
        let UnwrappedElement = <Form {...formProps}>
            {
                children ? 
                    children({
                        ...state,
                        handleChange: this.handleFieldChange, 
                        handleSubmit: this.handleSubmit, 
                    }) : ''
            }
        </Form>
        return (
            <ActiveFormContext.Provider value={{
                validating,
                isValid,
                validateReportMap,
                submitting,
                onFieldMount: this.handleFieldMount,
                onFieldChange: this.handleFieldChange,
            }}>
                { UnwrappedElement }
            </ActiveFormContext.Provider>
        );
    }
    private handleFieldMount(instance: any) {
        this.fields.push(instance);

        if (instance.getWidgetName)
            this.widgets.push(instance);
    }
    componentDidMount() {
        let { initialValue } = this.props,
            newValue: ValueType = {};

        for (let fieldName in initialValue) {
            let rawValue = initialValue[fieldName],
                widget = this.widgets.find(widget => widget && widget.getName() === fieldName);

            newValue[fieldName] = widget ? widget.parseValue(rawValue) : rawValue;
        }

        this.setState({ value: newValue });
    }
    private setValueTimer: number;
    private setValueQueue: Array<{value: ValueType, resolve: AnyFunction}> = [];
    setValue(value: ValueType, options: AnyPlainObject = {}): Promise<{}> {
        let promise = new Promise((resolve, reject) => {
                if (tools.isPlainObject(value)) {
                    this.setValueQueue.push({ value, resolve });
                } else {
                    let errorMsg = `[ActiveForm.setValue]value必须是对象类型，当前是${JSON.stringify(value)}`;
                    Log.error(errorMsg);
                    reject(errorMsg);
                }
            }),
            { validateOnChange } = this.props;
            
        window.clearTimeout(this.setValueTimer);
        this.setValueTimer = window.setTimeout(() => {
            let nextValue = {...this.state.value};

            this.setValueQueue.forEach(info => {
                nextValue = Object.assign(nextValue, info.value);
            });
            this.setState(
                { value: nextValue, validating: !!validateOnChange }, 
                () => {
                    this.setValueQueue.forEach(info => {
                        info.resolve();
                    });
                    this.setValueQueue = [];

                    if (validateOnChange) {
                        if (options.throttleValidate) {
                            this.throttleRunValidate();
                        } else {
                            this.runValidate();
                        }
                    }
                }
            );
        }, 0);
        return promise;
    }
    getValue() {
        return this.state.value;
    }
    setFieldValue(fieldName: string, fieldValue, options: AnyPlainObject = {}) {
        let { validateOnChange } = this.props,
            { value } = this.state,
            prevFieldValue = value[fieldName];

        if (fieldValue === prevFieldValue) {
            return;
        }

        value = {...value, [fieldName]: fieldValue};

        this.setState(
            { value, validating: !!validateOnChange }, 
            () => {
                if (validateOnChange) {
                    if (options.throllValidate) {
                        this.throttleRunFieldValidate(fieldName);
                    } else {
                        this.runFieldValidate(fieldName);
                    }
                }
            }
        );
    }
    getFieldValue(fieldName: string) {
        return this.state.value[fieldName];
    }
    private throttleRunValidate = tools.throttle(this.runValidate, THROTTLE_VALIDATE_DELAY);
    private runValidate() {
        let { onValidating, onValid, onInvalid } = this.props,
            { validating, validateReportMap } = this.state,
            validatePostProcess = ({ isValid, reportMap }: ValidateResult) => {
                this.updateValidateResult({ isValid, reportMap });

                isValid ? (onValid && onValid()) : (onInvalid && onInvalid());
            };

        if (!validating) {
            this.setState({ validating: true });
            onValidating && onValidating();
        }
        return this.validate().then(validatePostProcess).catch(error => {
            Log.error('[ActiveForm.validate]', error);
            Toast.error(error, 6000);
            validatePostProcess({ isValid: false, reportMap: validateReportMap });
        });
    }
    private throttleRunFieldValidate = tools.throttle(this.runFieldValidate, THROTTLE_VALIDATE_DELAY);
    private runFieldValidate(fieldName: string) {
        let { validating } = this.state,
            { onValidating, onValid, onInvalid } = this.props,
            validatePostProcess = (report: Report) => {
                this.updateValidateResult({isValid: report.isValid, reportMap: { [fieldName]: report }});

                report.isValid ? (onValid && onValid()) : (onInvalid && onInvalid());
            }

        if (!validating) {
            this.setState({ validating: true });
            onValidating && onValidating();
        }
        return this.validateField(fieldName).then(validatePostProcess).catch(error => {
            Log.error('[ActiveForm.validateField]', error);
            validatePostProcess({
                isValid: false,
                msg: error,
                level: 'error'
            });
        });
    }
    validate(): Promise<ValidateResult> {
        return new Promise((resolve, reject) => {
            let isValid = false,
                { validateRules } = this.props,
                ruleKeys = validateRules ? Object.keys(validateRules) : [],
                reportMap = {},
                validCount = 0, invalidCount = 0,
                promiseQueue: Array<Promise<Report>> = [];

            ruleKeys.forEach(fieldName => {
                promiseQueue.push(this.validateField(fieldName));
            });
            promiseQueue.push(this.handleValidate());

            promiseQueue.forEach((promise, i) => {
                let fieldName = ruleKeys[i];
                promise.then(report => {
                    if (!report.isValid)
                        isValid = false;

                    report.isValid ? validCount++ : invalidCount++;
                    reportMap[fieldName] = report;
                }).catch((error: Error) => {
                    isValid = false;
                    invalidCount++;
                    reportMap[fieldName] = {
                        isValid: false,
                        msg: error,
                        level: 'error',
                    };
                    Log.error('[ActiveForm.validateField]', error);
                }).then(() => {
                    if (validCount + invalidCount < promiseQueue.length) {
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
            fieldRules = validateRules && validateRules[fieldName],
            widget = this.widgets.find(widget => widget && widget.getName() === fieldName),
            widgetClass = widget && widget.getClass(),
            promiseQueue = [validateByFieldRules()];

        if (widgetClass && tools.isFunction(widgetClass.validate)) {
            promiseQueue.push(widgetClass.validate(fieldValue));
            // promiseQueue.push(new Promise(() => {throw new Error('demo Error')}));
        }

        return Promise.all(promiseQueue)
            .then((reportArr: Report[]) => {
                let invalidReport = reportArr.find(report => !report.isValid),
                    returnReport = invalidReport ? 
                        {
                            ...invalidReport,
                            fieldName
                        } : 
                        {
                            fieldName,
                            isValid: true,
                            msg: ''
                        };

                return Promise.resolve(returnReport);
            }).catch((result: Report | Error) => {
                if (result instanceof Error) {
                    throw result;
                } else {
                    return Promise.resolve({
                        ...result,
                        fieldName,
                    })
                }
            });

        function validateByFieldRules() {
            return new Promise((resolve, reject) => {
                if (!fieldRules) {
                    resolve({isValid: true, fieldName, msg: ''});
                    return;
                }
    
                if (!Array.isArray(fieldRules))
                    fieldRules = [fieldRules];
    
                Validator.validate(fieldValue, fieldRules).then((report: Report) => {
                    report.fieldName = fieldName;
                    resolve(report);
                });
            });
        }
    }
    private updateValidateResult({ isValid, reportMap }: ValidateResult) {
        let { validateReportMap } = this.state,
            nextValidateReportMap = {...validateReportMap},
            needUpdateReportMap = false,
            nextState: Partial<ActiveFormState> = {
                isValid,
                validating: false,
            };

        for (let fieldName in reportMap) {
            let report = reportMap[fieldName],
                prevReport = validateReportMap[fieldName];

            if (!tools.isPlainObject(report)) {
                continue;
            }
            if (!tools.isPlainObject(prevReport) || !Validator.compareReport(report, prevReport)) {
                needUpdateReportMap = true;

                nextValidateReportMap[fieldName] = report;
            }
        }
        if (needUpdateReportMap) {
            nextState.validateReportMap = nextValidateReportMap;
        }

        this.setState(nextState as ActiveFormState);
    }
    private handleValidate(): Promise<Report> {
        let { onValidate } = this.props;

        return new Promise((resolve, reject) => {
            if (tools.isFunction(onValidate)) {
                let result = onValidate(this.getValue());

                if (result instanceof Promise) {
                    result.then(resolve, (result: Report | Error) => {
                        if (result instanceof Error) {
                            reject(result);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    resolve(result);
                }
            } else {
                resolve({
                    isValid: true,
                    msg: ''
                });
            }
        });
    }
    // TODO 当瞬间多次触发submit时改如何处理
    submit() {
        let { onSubmit, name = '' } = this.props,
            submitPostProcess = () => {
                this.setState({ submitting: false });
            }
                
        this.setState({ submitting: true });
        this.runValidate().then(() => {
            if (onSubmit) {
                let result = onSubmit({name, value: this.getValue()});
            
                if (result instanceof Promise) {
                    result.then(submitPostProcess, submitPostProcess);
                } else {
                    submitPostProcess();
                }
            } else {
                submitPostProcess();
            }
        });
    }
    private handleSubmit() {
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

        function isCheckboxOrRadioEvent(event: any): event is CheckboxChangeEvent | RadioChangeEvent {
            return event.type === 'checkbox' || event.type === 'radio';
        }

        return {
            name: targetName,
            value: targetValue,
        };
    }
    private handleFieldChange(e: FieldChangeEvent) {
        let { name, value } = this.fetchFieldInfoByChangeEvent(e),
            prevValue = this.getValue()[name];

        if (prevValue !== value) {
            this.setFieldValue(name, value, { throllValidate: true });
        }
    }
    private handleFieldBlur() {
        // TODO   
    }
    private handleValid() {
        this.props.onValid && this.props.onValid();
    }
    private handleInvalid() {
        this.props.onInvalid && this.props.onInvalid();
    }
    private handleValidating() {
        this.props.onValidating && this.props.onValidating();
    }
    // private handleChange() {
    //     let { name = '', onChange } = this.props,
    //         { value } = this.state;

    //     onChange && onChange({ name, value });
    // }
}