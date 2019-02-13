import * as React from "react";
import Tools from "../../utils/Tools";
import { ActiveFormContext } from "./ActiveFormContext";
import { validator, Report, RuleParam } from "../../validate/Validator";
import { CSSAttrs, AnyFunction, AnyObject } from "../../utils/types";
import Log from "../../utils/Log";
import Widget, { FormWidgetProps } from "./Widget";
import Field, { FieldChangeEvent, FieldBlurEvent } from "./Field";
import activeFormCSS from './ActiveForm.scss';

declare namespace ActiveFormType {
    type Value = {[k in string]: any};
    type Action = 'submit' | 'change' | 'blur';
    type FieldReportMap = {[k in string]: Report}
    interface ValidateRules {[k: string]: RuleParam | RuleParam[]}
    interface ValidateResult {
        isValid: boolean;
        fieldReportMap?: ActiveFormType.FieldReportMap;
        validateError?: Error;
    }
    interface SetValueOptions {
        success?: AnyFunction;
        debounceValidate?: boolean;
    }
    interface Event {
        name: string;
        value: ActiveFormType.Value;
    }
    interface SubmitEvent extends Event {
        preventDefault: AnyFunction;
    }
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
        action?: string;
        method?: 'post' | 'get';
        target?: string;
        acceptCharset?: string;
        encType?: string;
        initialValue: ActiveFormType.Value;
        children?(e: RenderChildrenEvent): React.ReactNode;
        validateOnChange: boolean;
        validateOnBlur: boolean;
        validateRules: ValidateRules;
        onSubmit?(e: SubmitEvent): void | Promise<any>;
        onReset?(): void;
        // onChange?(e: ActiveFormChangeEvent): void;
        onValid?(e: ValidateReportEvent): void;
        onInvalid?(e: ValidateReportEvent): void;
        onValidating?(e: ValidateReportEvent): void;
        onValidate?(value: ActiveFormType.Value): Promise<Report[]> | Report[];
    }
    interface State {
        parsedInitialValue: ActiveFormType.Value;
        value: ActiveFormType.Value;
        submitting: boolean;
        validating: boolean;
        isValid: boolean;
        fieldReportMap: ActiveFormType.FieldReportMap;
        validateError?: Error;
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
    private formRef = React.createRef<HTMLFormElement>();
    constructor(props: ActiveFormType.Props) {
        super(props);

        this.state = {
            parsedInitialValue: {},
            value: {},
            submitting: false,
            validating: false,
            isValid: true,
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
        this.handleFieldBlur = this.handleFieldBlur.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
    }
    render() {
        let { props, state } = this,
            { name, children, validateRules, className, style, action, method, target } = props,
            { value, validating, isValid, fieldReportMap, validateError, submitting } = state,
            formProps = { name, action, method, target };

        console.log('ActiveForm rerender', JSON.stringify(this.state));
        let UnwrappedElement = children
            ? children({
                    ...state,
                    handleChange: this.handleFieldChange,
                    handleSubmit: this.handleSubmit,
                    handleReset: this.handleReset,
                })
            : '';

        return (
            <div style={style} className={tools.classNames(activeFormCSS.wrapper, className)}>
                <ActiveFormContext.Provider value={{
                    value,
                    validating,
                    isValid,
                    fieldReportMap,
                    validateError,
                    submitting,
                    validateRules,
                    onFieldMount: this.handleFieldMount,
                    onFieldChange: this.handleFieldChange,
                    onFieldBlur: this.handleFieldBlur,
                }}>
                    { UnwrappedElement }
                    {action ? 
                        <form ref={this.formRef} {...formProps} className={activeFormCSS.form}>
                            {submitting ?
                                Object.keys(value).map((name, i) => {
                                    let val = value[name];

                                    return <input key={i} name={name} type="hidden" value={JSON.stringify(val)} />
                                }) : ''
                            }
                        </form> : ''
                    }
                </ActiveFormContext.Provider>
            </div>
        );
    }
    private handleFieldMount(instance: any) {
        this.fields.push(instance);

        if (instance.getWidgetName)
            this.widgets.push(instance);
    }
    componentDidMount() {
        let { initialValue } = this.props,
            parsedInitialValue: ActiveFormType.Value = {},
            fieldReportMap = {};

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

            fieldReportMap[fieldName] = validator.getDefaultReport();
        });

        this.setState({ value: parsedInitialValue, parsedInitialValue, fieldReportMap });
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

        this.setState({ value, validating: !!validateOnChange }, callback);
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

        this.setState({ value, validating: !!validateOnChange }, callback);
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
        return this.validate()
            .then(validateResult => {
                this.validatePostProcess({...validateResult, action});
                return validateResult;
            });
    }
    private debounceRunFieldValidate = tools.debounce(this.runFieldValidate, DEBOUNCE_VALIDATE_DELAY);
    private runFieldValidate(fieldName: string, { action }: { action?: ActiveFormType.Action } = {}) {
        this.validatePreProcess();
        return this.validateField(fieldName)
            .then(report => {
                let { fieldReportMap } = this.state,
                    isValid = true;

                if (!report.isValid) {
                    isValid = false;
                } else {
                    for (let name in fieldReportMap) {
                        if (name !== report.fieldName && !fieldReportMap[name].isValid) {
                            isValid = false; break;
                        }
                    }
                }
                this.validatePostProcess({
                    isValid,
                    fieldReportMap: { [fieldName]: report },
                    action
                });
                return report;
            });
    }
    private validatePreProcess({ action }: { action?: ActiveFormType.Action } = {}) {
        let { name } = this.props,
            { value, validating, isValid, fieldReportMap, validateError } = this.state;

        if (!validating) {
            this.setState({ validating: true });
            this.handleValidating({ name, value, action, isValid, fieldReportMap, validateError });
        }
    }
    validate(): Promise<ActiveFormType.ValidateResult> {
        let { validateRules } = this.props,
            promiseQueue: Array<Promise<Report>> = [],
            fieldReportMap = {};

        for (let fieldName in validateRules) {
            promiseQueue.push(this.validateField(fieldName));
        }
        return Promise.all([
            Promise.all(promiseQueue),
            this.handleValidate().catch((e: Error) => {
                Log.error(e);
                return e;
            })
        ]).then((arr) => {
            let fieldReports = arr[0], validateReports = arr[1],
                reports = [...fieldReports, ...tools.isArray(validateReports) ? validateReports : []],
                isValid = true,
                validateError;

            reports.forEach(report => {
                let { fieldName } = report;
                if (fieldName)
                    fieldReportMap[fieldName] = report;
                
                if (!report.isValid && isValid) {
                    isValid = false;
                }
            });
            if (tools.isError(validateReports)) {
                isValid = false;
                validateError = validateReports;
            }
            return { isValid, fieldReportMap, validateError };
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
            promiseQueue.push(validator.validate(fieldValue, fieldRules));
        }
        if (widgetClass && tools.isFunction(widgetClass.validate)) {
            promiseQueue.push(widgetClass.validate(fieldValue));
            // promiseQueue.push(new Promise(() => {throw new Error('demo Error')}));
        }

        return Promise.all(promiseQueue)
            .then((reportArr: Report[]) => {
                let firstInvalidReport = reportArr.find(report => !report.isValid),
                    report = firstInvalidReport ? firstInvalidReport : validator.getDefaultReport();

                report.fieldName = fieldName;
                return report;
            }).catch((result: Report | Error) => {
                if (tools.isError(result)) {
                    Log.error('[ActiveForm.validateField]', result);

                    return {
                        isValid: false,
                        msg: result + '',
                        level: 'error',
                        fieldName,
                    } as Report;
                } else {
                    result.fieldName = fieldName;
                    return result;
                }
            });
    }
    private validatePostProcess(validateResult: ActiveFormType.ValidateResult & { action?: ActiveFormType.Action }) {
        let { name } = this.props,
            { value } = this.state,
            { isValid, fieldReportMap, validateError, action } = validateResult,
            nextState: Partial<ActiveFormType.State> = {
                isValid,
                validating: false,
                validateError,
                fieldReportMap: { ...this.state.fieldReportMap, ...fieldReportMap },
            };
        this.setState(nextState as ActiveFormType.State);

        let validateReportEvent = {
            name,
            value,
            action,
            isValid,
            fieldReportMap: nextState.fieldReportMap,
            validateError,
        };

        isValid ? this.handleValid(validateReportEvent) : this.handleInvalid(validateReportEvent);
    }
    private handleValidate(): Promise<Report[]> {
        let { onValidate } = this.props;

        return new Promise((resolve, reject) => {
            if (tools.isFunction(onValidate)) {
                let result, catched = false;
                
                try {
                    result = onValidate(this.getValue());
                } catch(e) {
                    reject(e);
                    catched = true;
                }

                if (catched)
                    return;

                let processResult = result => {
                        if (tools.isArray(result)) {
                            resolve(result.filter(report => validator.isValidReport(report)));
                        } else if (tools.isError(result)) {
                            reject(result);
                        } else {
                            reject(new Error(`onValidate只能返回数组，请检查，
                                当前返回: ${JSON.stringify(result)},
                                有效的返回: Array<{ fieldName: string, isValid: boolean, level: 'error' | 'warn', msg: string}>`));
                        }
                    }

                if (tools.isPromise(result)) {
                    result.then(processResult, processResult);
                } else {
                    processResult(result);
                }
            } else {
                resolve([]);
            }
        });
    }
    // onValidate() {

    // }
    // onAfterInit() {

    // }
    submit() {
        let { onSubmit, name } = this.props,
            postProcess = (args: AnyObject) => {
                if (!args.preventDefault) {
                    this.formRef && this.formRef.current && this.formRef.current.submit();
                }
                this.setState({ submitting: false });
            };
        this.setState({ submitting: true });
        this.runValidate({ action: 'submit' }).then((validateResult) => {
            if (!validateResult.isValid) {
                this.setState({ submitting: false });
                return;
            }

            let preventDefault = false;
            if (onSubmit) {
                let result = onSubmit({
                    name,
                    value: this.getValue(),
                    preventDefault: () => {
                        preventDefault = true;
                    }
                });

                if (tools.isPromise(result)) {
                    result
                        .then(() => {
                            postProcess({preventDefault});
                        })
                        .catch(() => {
                            postProcess({preventDefault});
                        });
                } else {
                    postProcess({preventDefault});
                }
            } else {
                postProcess({preventDefault});
            }
        });
    }
    reset() {
        this.setValue(this.state.parsedInitialValue, () => {
            this.props.onReset && this.props.onReset();
        });
    }
    private handleSubmit() {
        this.submit();
    }
    private handleReset() {
        this.reset();
    }
    private handleFieldChange(e: FieldChangeEvent) {
        let { name, value } = Field.getInfoByFieldEvent(e),
            prevValue = this.getValue()[name];

        if (prevValue !== value) {
            this.setFieldValue(name, value, { debounceValidate: true });
        }
    }
    private handleFieldBlur(e: FieldBlurEvent) {
        let { validateOnBlur } = this.props,
            { name } = Field.getInfoByFieldEvent(e);
        validateOnBlur && this.runFieldValidate(name, { action: 'blur' });
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