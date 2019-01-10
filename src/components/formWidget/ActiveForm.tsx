import * as React from "react";
import Tools from "../../utils/Tools";
import { ActiveFormContext } from "./ActiveFormContext";
import Validator, { Report, Rule } from "./Validator";
import { CSSAttrs, AnyFunction, AnyPlainObject } from "../../utils/types";
import Log from "../../utils/Log";
import Widget, { FormWidgetChangeEvent, FormWidgetProps } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";
import { FieldChangeEvent } from "./Field";

declare namespace ActiveFormType {
    type Value = {[k in string]: any};
    type Action = 'submit' | 'change' | 'blur';
    type FieldReportMap = {[k in string]: Report}
    interface ValidateRules {[k: string]: Rule | Rule[]}
    interface ValidateResult {
        isValid: boolean;
        validateReport: Report;
        fieldReportMap?: ActiveFormType.FieldReportMap;
    }
    interface SetValueOptions {
        success?: AnyFunction;
        debounceValidate?: boolean;
    }
    interface Event {
        name: string;
        value: ActiveFormType.Value;
    }
    interface SubmitEvent extends Event {}
    interface ChangeEvent extends Event {}
    
    interface ValidateReportEvent extends Event, ValidateResult {
        action?: ActiveFormType.Action;
    }
    interface RenderChildrenEvent extends State {
        value: ActiveFormType.Value;
        handleChange: AnyFunction;
        handleSubmit: AnyFunction;
        handleReset: AnyFunction;
        isValid: boolean;
        submitting: boolean;
        validating: boolean;
    }
    interface Props extends CSSAttrs {
        name: string;
        initialValue: ActiveFormType.Value;
        children?(e: RenderChildrenEvent): React.ReactNode;
        validateOnChange: boolean;
        validateOnBlur: boolean;
        onSubmit?(e: SubmitEvent): void | Promise<any>;
        onReset?(): void;
        // onChange?(e: ActiveFormChangeEvent): void;
        onValid?(e: ValidateReportEvent): void;
        onInvalid?(e: ValidateReportEvent): void;
        onValidating?(e: ValidateReportEvent): void;
        onValidate?(value: ActiveFormType.Value): Promise<Report> | Report;
        validateRules: ValidateRules;
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
    interface State {
        parsedInitialValue: ActiveFormType.Value;
        value: ActiveFormType.Value;
        submitting: boolean;
        validating: boolean;
        isValid: boolean;
        validateReport: Report;
        fieldReportMap: ActiveFormType.FieldReportMap;
    }
}
export { ActiveFormType };

const tools = Tools.getInstance();
const DEBOUNCE_VALIDATE_DELAY = 500;
export default class ActiveForm extends React.PureComponent<ActiveFormType.Props, ActiveFormType.State> {
    static defaultProps = {
        name: '',
        initialValue: {},
        validateOnChange: false,
        validateOnBlur: false,
        validateRules: {},
    };
    readonly state: ActiveFormType.State;
    private readonly fields: React.ReactInstance[] = [];
    private readonly widgets: Array<React.Component<FormWidgetProps> & Widget> = [];
    constructor(props: ActiveFormType.Props) {
        super(props);

        this.state = {
            parsedInitialValue: {},
            value: {},
            submitting: false,
            validating: false,
            isValid: true,
            validateReport: Validator.getDefaultReport(),
            fieldReportMap: {}
        };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleValidating = this.handleValidating.bind(this);
        this.handleValid = this.handleValid.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleFieldMount = this.handleFieldMount.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
    }
    render() {
        let { props, state } = this,
            { name, children, validateRules } = props,
            { value, validating, isValid, validateReport, fieldReportMap, submitting } = state;

        console.log('ActiveForm rerender', JSON.stringify(this.state));
        let UnwrappedElement = <React.Fragment>
            {
                children ? 
                    children({
                        ...state,
                        handleChange: this.handleFieldChange, 
                        handleSubmit: this.handleSubmit,
                        handleReset: this.handleReset,
                    }) : ''
            }
        </React.Fragment>
        return (
            <ActiveFormContext.Provider value={{
                value,
                validating,
                isValid,
                validateReport,
                fieldReportMap,
                submitting,
                onFieldMount: this.handleFieldMount,
                onFieldChange: this.handleFieldChange,
                validateRules: validateRules
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
            parsedInitialValue: ActiveFormType.Value = {};

        this.fields.forEach((field: any) => {
            let fieldName;

            if (tools.isPlainObject(field.props)) {
                let fieldProps = field.props;
                fieldName = fieldProps.hasOwnProperty('name') ? fieldProps.name : '';
            } else if (field instanceof HTMLElement) {
                fieldName = field.getAttribute('name') || '';
            } else {
                fieldName = '';
            }

            let rawValue = initialValue[fieldName],
                widget = this.widgets.find(widget => widget && widget.getName() === fieldName);
            
            if (widget) {
                parsedInitialValue[fieldName] = widget.parseValue(rawValue);
            } else {
                parsedInitialValue[fieldName] = (rawValue !== undefined && rawValue !== null ? rawValue : '');
            }
        });

        this.setState({ value: parsedInitialValue, parsedInitialValue });
    }
    setValue(value: ActiveFormType.Value, callbackOrOptions?: AnyFunction | ActiveFormType.SetValueOptions) {
        let { validateOnChange } = this.props,
            prevValue = this.state.value,
            callback = () => {}, options: ActiveFormType.SetValueOptions = {};
        
        if (tools.isFunction(callbackOrOptions)) {
            callback = callbackOrOptions;
        } else if (tools.isPlainObject(callbackOrOptions)) {
            options = callbackOrOptions;
            if (tools.isFunction(options.success))
                callback = options.success;
        }

        value = {...prevValue, ...value};

        this.setState({ value }, callback);
        if (validateOnChange) {
            if (options.debounceValidate) {
                this.debounceRunValidate({ action: 'change' });
            } else {
                this.runValidate({ action: 'change' });
            }
        }
    }
    getValue() {
        return this.state.value;
    }
    setFieldValue(fieldName: string, fieldValue, callbackOrOptions?: AnyFunction | ActiveFormType.SetValueOptions) {
        let { validateOnChange } = this.props,
            { value } = this.state,
            callback = () => {}, options: ActiveFormType.SetValueOptions = {};

        if (tools.isFunction(callbackOrOptions)) {
            callback = callbackOrOptions;
        } else if (tools.isPlainObject(callbackOrOptions)) {
            options = callbackOrOptions;
            if (tools.isFunction(options.success))
                callback = options.success;
        }

        value = {...value, [fieldName]: fieldValue};

        this.setState({ value }, callback);
        if (validateOnChange) {
            if (options.debounceValidate) {
                this.debounceRunFieldValidate(fieldName, { action: 'change' });
            } else {
                this.runFieldValidate(fieldName, { action: 'change' });
            }
        }
    }
    getFieldValue(fieldName: string) {
        return this.state.value[fieldName];
    }
    private debounceRunValidate = tools.debounce(this.runValidate, DEBOUNCE_VALIDATE_DELAY);
    private runValidate({ action }: { action?: ActiveFormType.Action } = {}) {
        this.validatePreProcess();
        return this.validate().then(validateResult => {
            this.validatePostProcess({...validateResult, action});
        }).catch((error: Error) => {
            Log.error('[ActiveForm.validate]', error);
            this.validatePostProcess({ 
                isValid: false, 
                validateReport: {
                    isValid: false, 
                    msg: error + '', 
                    level: 'error'
                }, 
                action 
            });
        });
    }
    private debounceRunFieldValidate = tools.debounce(this.runFieldValidate, DEBOUNCE_VALIDATE_DELAY);
    private runFieldValidate(fieldName: string, { action }: { action?: ActiveFormType.Action } = {}) {        
        this.validatePreProcess();
        return this.validateField(fieldName).then(report => {
            this.validatePostProcess(
                { isValid: report.isValid, validateReport: report, fieldReportMap: { [fieldName]: report }, action });
        }).catch(error => {
            Log.error('[ActiveForm.validateField]', error);

            let report: Report = {
                isValid: false,
                msg: error + '',
                level: 'error'
            };
            this.validatePostProcess({ 
                isValid: false, 
                validateReport: report,
                fieldReportMap: { 
                    [fieldName]: report,
                },
                action
            });
        });
    }
    private validatePreProcess({ action }: { action?: ActiveFormType.Action } = {}) {
        let { name } = this.props,
            { value, validating, isValid, validateReport, fieldReportMap } = this.state;

        if (!validating) {
            this.setState({ validating: true });
            this.handleValidating({
                name,
                value,
                action,
                isValid,
                validateReport,
                fieldReportMap,
            });
        }
    }
    private validatePostProcess(result: ActiveFormType.ValidateResult & { action?: ActiveFormType.Action }) {
        let { isValid, validateReport, fieldReportMap, action } = result,
            { name } = this.props,
            { value } = this.state,
            validateReportEvent = {
                name,
                value,
                action,
                isValid,
                validateReport,
                fieldReportMap,
            };
            
        this.updateValidateResult({ isValid, validateReport, fieldReportMap });

        isValid ? this.handleValid(validateReportEvent) : this.handleInvalid(validateReportEvent);
    }
    validate(): Promise<ActiveFormType.ValidateResult> {
        let { validateRules } = this.props,
            ruleKeys = validateRules ? Object.keys(validateRules) : [],
            promiseQueue: Array<Promise<Report>> = [],
            validateReport,
            fieldReportMap = {},
            isValid = true;

        ruleKeys.forEach(fieldName => {
            promiseQueue.push(this.validateField(fieldName));
        });
        promiseQueue.push(this.handleValidate());

        return Promise.all(promiseQueue)
            .then(reports => {
                let firstInvalidReport;
                reports.forEach(report => {
                    let { fieldName } = report;
                    if (fieldName)
                        fieldReportMap[fieldName] = report;

                    if (!report.isValid && firstInvalidReport === undefined) {
                        isValid = false;
                        firstInvalidReport = report;
                    }
                });
                validateReport = firstInvalidReport || Validator.getDefaultReport();
                return { isValid, validateReport, fieldReportMap};
            });
    }
    validateField(fieldName: string): Promise<Report> {
        let { validateRules } = this.props,
            { value } = this.state,
            fieldValue = value[fieldName],
            fieldRules = validateRules && validateRules[fieldName],
            widget = this.widgets.find(widget => widget && widget.getName() === fieldName),
            widgetClass = widget && widget.getClass(),
            promiseQueue: Array<Promise<Report>> = [];

        if (fieldRules) {
            if (!Array.isArray(fieldRules))
                fieldRules = [fieldRules];
            promiseQueue.push(Validator.validate(fieldValue, fieldRules));
        }
        if (widgetClass && tools.isFunction(widgetClass.validate)) {
            promiseQueue.push(widgetClass.validate(fieldValue));
            // promiseQueue.push(new Promise(() => {throw new Error('demo Error')}));
        }

        return Promise.all(promiseQueue)
            .then((reportArr: Report[]) => {
                let firstInvalidReport = reportArr.find(report => !report.isValid),
                    returnReport = firstInvalidReport ? 
                        {
                            ...firstInvalidReport,
                            fieldName
                        } : 
                        {
                            fieldName,
                            isValid: true,
                            msg: ''
                        };

                return Promise.resolve(returnReport);
            }).catch((result: Report | Error) => {
                if (tools.isError(result)) {
                    throw result;
                } else {
                    return Promise.resolve({
                        ...result,
                        fieldName,
                    })
                }
            });
    }
    private updateValidateResult(validateResult: ActiveFormType.ValidateResult) {
        let { validateReport, fieldReportMap } = this.state,
            nextFieldReportMap = {...fieldReportMap},
            needUpdateReportMap = false,
            nextState: Partial<ActiveFormType.State> = {
                isValid: validateResult.isValid,
                validating: false,
            };

        if (!Validator.compareReport(validateResult.validateReport, validateReport)) {
            nextState.validateReport = validateResult.validateReport;
        }
        for (let fieldName in validateResult.fieldReportMap) {
            let report = validateResult.fieldReportMap[fieldName],
                prevReport = fieldReportMap[fieldName];

            if (!tools.isPlainObject(report)) {
                continue;
            }
            if (!tools.isPlainObject(prevReport) || !Validator.compareReport(report, prevReport)) {
                needUpdateReportMap = true;

                nextFieldReportMap[fieldName] = report;
            }
        }
        if (needUpdateReportMap) {
            nextState.fieldReportMap = nextFieldReportMap;
        }

        this.setState(nextState as ActiveFormType.State);
    }
    private handleValidate(): Promise<Report> {
        let { onValidate } = this.props;

        return new Promise((resolve, reject) => {
            if (tools.isFunction(onValidate)) {
                let result = onValidate(this.getValue()),
                    processResult = result => {
                        if (tools.isError(result)) {
                            reject(result);
                        } else if (Validator.isValidReport(result)) {
                            resolve(result);
                        } else {
                            reject(new Error(`无效的校验逻辑，请检查onValidate返回结果是否正确，
                                当前返回: ${JSON.stringify(result)},
                                有效的返回: { fieldName: string, isValid: boolean, level: 'error' | 'warn', msg: string}`));
                        }
                    }

                if (tools.isPromise(result)) {
                    result.then(processResult, processResult);
                } else {
                    processResult(result);
                    
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
        let { onSubmit, name } = this.props,
            submitPostProcess = () => {
                this.setState({ submitting: false });
            }
                
        this.setState({ submitting: true });
        this.runValidate({ action: 'submit' }).then(() => {
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
    reset() {
        this.setValue({ value: this.state.parsedInitialValue }, () => {
            this.props.onReset && this.props.onReset();
        });
    }
    private handleReset() {
        this.reset();
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
            this.setFieldValue(name, value, { debounceValidate: true });
        }
    }
    private handleFieldBlur() {
        // TODO   
    }
    private handleValid(e: ActiveFormType.ValidateReportEvent) {
        this.props.onValid && this.props.onValid(e);
    }
    private handleInvalid(e: ActiveFormType.ValidateReportEvent) {
        this.props.onInvalid && this.props.onInvalid(e);
    }
    private handleValidating(e: ActiveFormType.ValidateReportEvent) {
        this.props.onValidating && this.props.onValidating(e);
    }
    // private handleChange() {
    //     let { name = '', onChange } = this.props,
    //         { value } = this.state;

    //     onChange && onChange({ name, value });
    // }
}