import * as React from "react";
import Tools from "../../utils/Tools";
import { FormContext } from "./FormContext";
import { Report } from "./Validator";
import { CSSAttrs, AnyFunction } from "../../utils/types";
import FormItem, { FormItemProps } from "../FormItem";
import Form from "../Form";
import Log from "../../utils/Log";
import { FormWidgetChangeEvent } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";

type ValueType = {[k in string]: any};
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
    fields: FormItemProps[];
    handleChange: AnyFunction;
    handleSubmit: AnyFunction;
    isValid: boolean;
    submitting: boolean;
}
export interface ActiveFormProps extends CSSAttrs {
    name?: string;
    initialFields?: FormItemProps[];
    initialValue?: ValueType;
    children?: (e: ActiveFormRenderEvent) => JSX.Element;
    onSubmit?: (e: ActiveFormSubmitEvent) => void | Promise<any>;
    onChange?: (e: ActiveFormChangeEvent) => void;
    onValid?: () => void;
    onInvalid?: () => void;
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
    isValid: boolean;
    submitting: boolean;
    fields: FormItemProps[];
}
const tools = Tools.getInstance();
export default class ActiveForm extends React.PureComponent<ActiveFormProps, ActiveFormState> {
    readonly state: ActiveFormState;
    constructor(props: ActiveFormProps) {
        super(props);

        this.state = {
            isValid: true,
            submitting: false,
            fields: props.initialFields || [],
            value: this.getValueByProps(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleWidgetMount = this.handleWidgetMount.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    private getValueByProps() {
        let { initialValue, initialFields } = this.props,
            result: ValueType = {};

        if (tools.isPlainObject(initialValue)) {
            for (let k in initialValue) {
                result[k] = initialValue[k];
            }
        } else {
            if (tools.isArray(initialFields)) {
                initialFields.forEach(field => {
                    if (!tools.isPlainObject(field)) {
                        return;
                    }
                    
                    let { componentProps } = field;
    
                    if (!tools.isPlainObject(componentProps)) {
                        return;
                    }
    
                    let { name, value } = componentProps;
    
                    if (value !== undefined) {
                        result[name] = value;
                    }
                });
            }
        }

        return result;
    }
    private readonly widgets: React.ReactInstance[] = [];
    render() {
        let { props, state } = this,
            { name, children } = props,
            { fields, submitting, isValid, value } = state,
            formProps = { name };

        let UnwrappedElement = <Form {...formProps}>
            {
                children ? 
                    children({ 
                        value, 
                        fields,
                        handleChange: this.handleFieldChange, 
                        handleSubmit: this.handleSubmit, 
                        isValid, 
                        submitting 
                    }) : 
                    this.renderFields(fields, value)
            }
        </Form>
        return (
            <FormContext.Provider value={{ 
                onWidgetChange: this.handleFieldChange, 
                onWidgetMount: this.handleWidgetMount,
                submitting,
            }}>
                { UnwrappedElement }
            </FormContext.Provider>
        )
    }
    private renderFields(fields: FormItemProps[], initialValue: ValueType) {
        let { submitting } = this.state,
            { onChange } = this.props;
        
        return (
            <React.Fragment>
                {
                    fields.map((field: FormItemProps, i) => {
                        let { component, label, componentProps = {}, render} = field;
                        
                        componentProps = Object.assign({}, componentProps, {
                            submitting,
                            value: initialValue[componentProps.name],
                            onChange,
                        })
                        return (
                            <FormItem key={i} label={label} component={component} componentProps={componentProps} render={render}></FormItem>
                        )
                    })
                }
            </React.Fragment>
        )
    }
    private handleWidgetMount(widgetInstance: any) {
        this.widgets.push(widgetInstance);
    }
    private setValueTimer = 0;
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
            });
        }, 0);
        return promise;
    }
    getValue() {
        return this.state.value;
    }
    // TODO 当瞬间多次触发submit时改如何处理
    submit() {
        let { onSubmit, onValid, onInvalid, name = '' } = this.props,
            isValid = true,
            handleFinally = () => {
                this.setState({ isValid }, () => {
                    let updateFormState = () => {
                        this.setState({ submitting: false });
                    };

                    if (isValid) {
                        onValid && onValid();
                    } else {
                        onInvalid && onInvalid();
                        updateFormState();
                        return;
                    }

                    if (onSubmit) {
                        let result = onSubmit({name, value: this.getValue()});
                    
                        if (result instanceof Promise) {
                            result.then(updateFormState).catch(updateFormState);
                        } else {
                            updateFormState();
                        }
                    } else {
                        updateFormState();
                    }
                })
            }

        this.setState({ submitting: true });
        this.validate()
            .then(handleFinally)
            .catch((error) => {
                isValid = false;
                if (error instanceof Error) {
                    Log.error(error);
                    alert(error);
                } else {
                    this.validateReport(error);
                }
                handleFinally();
            });
    }
    validateReport(reports: Report[]) {
        let { widgets } = this;

        widgets.forEach((widget: any) => {
            let targetReport = reports.find(report => report.fieldName === widget.props.name);

            targetReport && widget.validateReport(targetReport);
        });
    }
    validate(): Promise<any> {
        let isValid = true,
            invalidReports: Report[] = [],
            validCount = 0, invalidCount = 0,
            processor = (resolve: AnyFunction, reject: AnyFunction) => {
                this.widgets.forEach((widget: any) => {
                    widget.validate().then((report: Report) => {
                        if (!report.isValid) {
                            isValid = false;
                            invalidCount ++;
                            invalidReports.push(report);
                        } else {
                            validCount ++;
                        }
                    }).catch((e: Error) => {
                        let report: Report = {
                            fieldName: widget.props.name,
                            msg: e.message,
                            isValid,
                        };
                        isValid = false;
                        invalidCount ++;
                        invalidReports.push(report)
                    }).finally(() => {
                        if (validCount + invalidCount < this.widgets.length) {
                            return;
                        }
                        isValid ? resolve() : reject(invalidReports);
                    });
                });
            }

        return new Promise(processor.bind(this));
    }
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.submit();
    }
    private fetchFieldInfoByChangeEvent(e: FieldChangeEvent) {
        let targetName: string,
            targetValue: any;

        if (isRawEvent(e)) {
            let target = e.target;

            targetName = String(target.name);

            if (target.nodeName === 'INPUT' && (target.type === 'checkbox' || target.type === 'radio')) {
                targetValue = target.checked;
            } else {
                targetValue = target.value;
            }
        } else if (isCheckboxOrRadioEvent(e)) {
            targetName = e.name;
            targetValue = e.checked;
        } else {
            targetName = e.name;
            targetValue = e.value;
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
        let widgetInfo = this.fetchFieldInfoByChangeEvent(e);

        this.setValue({[widgetInfo.name]: widgetInfo.value});
    }
    private handleChange() {
        let { name = '', onChange } = this.props,
            { value } = this.state;

        onChange && onChange({ name, value });
    }
}