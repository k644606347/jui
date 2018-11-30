import * as React from "react";
import Tools from "../../utils/Tools";
import { FormProps, FormState } from "../FormType";
import Config from "./Config";
import { FormContext } from "./FormContext";
import { Report } from "./Validator";
import { CSSAttrs, Omit, AnyFunction } from "../../utils/types";
import FormItem, { FormItemProps } from "../FormItem";
import Form from "../Form";
import Log from "../../utils/Log";
import { FormWidgetChangeEvent } from "./Widget";

type FormValue = {[k in string]: any};
export interface ActiveFormSubmitEvent {
    value: {[k in string] : any}
}
export interface ActiveFormChangeEvent {
    fieldName: string;
    fieldValue: any;
    value: FormValue;
}

type FieldChangeEvent = React.ChangeEvent<any> | FormWidgetChangeEvent;
interface ChildrenMethodParams {
    value: FormValue, 
    handleChange: AnyFunction, 
    handleSubmit: AnyFunction, 
    isValid: boolean, 
    submitting: boolean
}
export interface ActiveFormProps extends CSSAttrs, Omit<FormProps, 'onSubmit' | 'isValid'> {
    name?: string;
    initialFields?: FormItemProps[];
    initialValue?: FormValue;
    children?: (e: ChildrenMethodParams) => JSX.Element;
    onSubmit?: (e: ActiveFormSubmitEvent) => void | Promise<any>;
    onChange?: (e: ActiveFormChangeEvent) => void;
    onValid?: () => void;
    onInvalid?: () => void;
    // action: string;// TODO
    // method: 'post' | 'get';
}
export interface ActiveFormState {
    value: FormValue;
    isValid: boolean;
    submitting: boolean;
    fields: ActiveFormProps['initialFields'];
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    private readonly widgets: any = [];
    render() {
        let { props, state } = this,
            { children } = props,
            { fields, submitting, isValid, value } = state;

        let UnwrappedElement = children ? 
                                    children({ value, handleChange: this.handleChange, handleSubmit: this.handleSubmit, isValid, submitting }) : 
                                    fields ? 
                                        <Form>{this.renderFields(fields, value)}</Form> : 
                                        <div></div>;

        return (
            <FormContext.Provider value={{ 
                onWidgetChange: this.handleChange, 
                onWidgetMount: this.handleWidgetMount,
                submitting,
            }}>
                { UnwrappedElement }
            </FormContext.Provider>
        )
    }
    private renderFields(fields: FormItemProps[], initialValue: FormValue) {
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
    private getValueByProps() {
        let { initialValue, initialFields } = this.props,
            result: FormValue = {};

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
        if (tools.isPlainObject(initialValue)) {
            for (let k in initialValue) {
                result[k] = initialValue[k];
            }
        }

        return result;
    }    
    private handleWidgetMount(widgetInstance: any) {
        this.widgets.push(widgetInstance);
    }
    setValue(value: any): Promise<ActiveFormState['value']> {
        return new Promise((resolve, reject) => {
            if (!tools.isPlainObject(value)) {
                let errorMsg = `[ActiveForm.setValue]value必须是对象类型，当前是${JSON.stringify(value)}`;
                Log.error(errorMsg);
                reject(errorMsg);
            }
            this.setState({
                value
            }, () => {
                resolve(this.state.value);
            });
        });
    }
    getValue() {
        return this.state.value;
    }
    clean() {
        this.setState({ value: {} });
    }
    // setValue(value: FormValue) {
    //     if (!tools.isPlainObject(value)) {
    //         Log.error(`[ActiveForm.setValue]value必须是对象类型，当前是${JSON.stringify(value)}`);
    //         return false;
    //     }

    //     this.widgets.forEach((w: any) => {
    //         if (!value.hasOwnProperty(w.props.name)) {
    //             return;
    //         }
    //         w.setValue(value[w.props.name]);
    //     });

    //     return true;
    // }
    // getValue() {
    //     let value = {};
    //     this.widgets.forEach((w: any) => {
    //         value[w.props.name] = w.getValue();
    //     });

    //     return value;
    // }
    // clean() {
    //     this.widgets.forEach((w: any) => {
    //         tools.isFunction(w.clean) && w.clean();
    //     });
    // }
    // clean() {
    //     let { value } = this.state;

    //     for(let k in value) {
    //         value[k] = undefined;
    //     }
    //     this.setState({ value });
    // }
    // TODO 当瞬间多次触发submit时改如何处理
    submit() {
        let { onSubmit, onValid, onInvalid } = this.props,
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
                        let result = onSubmit({value: this.getValue()});
                    
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
            processor = (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
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
    private handleChange(e: FieldChangeEvent) {
        let { onChange } = this.props,
            { value } = this.state,
            targetName: string, 
            targetValue: any,
            nextValue = {...value};

        if (isActiveFormChangeEvent(e)) {
            targetName = e.name === undefined ? '' : e.name;
            targetValue = e.value;
        } else {
            targetName = String(e.target.name);
            targetValue = e.target.value;
        }

        nextValue[targetName] = targetValue;
        this.setState({
            value: nextValue
        }, () => {
            onChange && onChange({ value: nextValue, fieldName: targetName, fieldValue: targetValue }); 
        });

        function isActiveFormChangeEvent(event: any): event is FormWidgetChangeEvent {
            return event.formWidgetEvent;
        }
    }
}