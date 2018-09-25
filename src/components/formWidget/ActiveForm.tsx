import * as React from "react";
import Tools from "../../utils/Tools";
import { FormProps, FormState } from "../FormType";
import Config from "./Config";
import { FormContext } from "../FormContext";
import { Report } from "./Validator";
import { FieldProps } from "../FieldType";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";
import { CSSAttrs, Omit } from "../../utils/types";
import cm from './ActiveForm.scss';
import Field from "../Field";
import Form from "../Form";
import Log from "../../utils/Log";

export interface ActiveFormSubmitEvent {
    value: {[k in string] : any}
}
export interface ActiveFormProps extends CSSAttrs, Omit<FormProps, 'onSubmit' | 'isValid'> {
    onSubmit?: (e: ActiveFormSubmitEvent) => void;
    onChange?: (e: any) => void;
    onValid?: () => void;
    onInvalid?: () => void;
    // action: string;// TODO
    // method: 'post' | 'get';
}
export interface ActiveFormState {
    isValid?: boolean;
}
const tools = Tools.getInstance();

function renderFields(fields: FieldProps[]) {
    return (
        <React.Fragment>
            {
                fields.map((field: FieldProps, i) => {
                    let { widget, label, renderWidget, widgetProps } = field;
                    return (
                        <Field key={i} label={label} widget={widget} widgetProps={widgetProps} renderWidget={renderWidget}></Field>
                    )
                })
            }
        </React.Fragment>
    )
}
function create(target: React.ComponentType<ActiveFormProps> | FieldProps[], options?: any): React.ComponentClass<ActiveFormProps> {
    let UnwrappedElement = tools.isFunction(target) ? React.createElement(target) : 
                                    <Form>{renderFields(target as FieldProps[])}</Form>;
    
    class ActiveForm extends React.PureComponent<ActiveFormProps, ActiveFormState> {
        readonly state: ActiveFormState;
        constructor(props: ActiveFormProps) {
            super(props);
    
            this.state = {
                isValid: true,
            };
            this.handleChange = this.handleChange.bind(this);
            this.handleWidgetMount = this.handleWidgetMount.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        private readonly widgets: any = [];
        render() {
            let { props, state } = this,
                { isValid } = state;
    
            return (
                <FormContext.Provider value={{ onChange: this.handleChange, onWidgetMount: this.handleWidgetMount }}>
                    {
                        React.cloneElement(UnwrappedElement, {
                            className: tools.classNames(cm.wrapper, isValid && cm.isValid),
                            onSubmit: this.handleSubmit,
                        })
                    }
                </FormContext.Provider>
            )
        }
        private handleWidgetMount(widgetInstance: any) {
            this.widgets.push(widgetInstance);
        }
        getValue() {
            let value = {};
            this.widgets.forEach((w: any) => {
                value[w.props.name] = w.getValue();
            });
    
            return value;
        }
        submit() {
            let { onSubmit, onValid, onInvalid } = this.props,
                isValid = true;
    
            this.validate()
                .catch((error) => {
                    isValid = false;
                    if (error instanceof Error) {
                        Log.error(error);
                        alert(error);
                    } else {
                        this.validateReport(error);
                    }
                })
                .finally(() => {
                    this.setState({ isValid }, () => {
                        if (isValid) {
                            onValid && onValid();
                        } else {
                            onInvalid && onInvalid();
                        }
                        onSubmit && onSubmit({
                            value: this.getValue(),
                        });
                    })
                })
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
        private handleChange(e: any) {
            let { onChange } = this.props;
    
            onChange && onChange({ value: this.getValue() });
        }
    }

    return ActiveForm;
}
export default {
    create,
};