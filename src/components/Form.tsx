import * as React from "react";
import { FormProps, FormState } from "./FormType";
import Tools from "../utils/Tools";
import Field from "./Field";
import cm from './Form.scss';
import { FormContext } from "./FormContext";
import Config from "./formWidget/Config";
import { FieldProps } from "./FieldType";
import { Report } from "./formWidget/Validator";
import Log from "../utils/Log";

const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, FormState> {
    readonly state: FormState;
    static defaultProps: Partial<FormProps> = {
        isValid: true
    }
    static isWidgetElement = (node: React.ReactNode) => {
        let isWidget = false;
        if (!React.isValidElement(node)) {
            return false;
        }
        for (let key in Config) {
            if (node.type === Config[key].widget) {
                isWidget = true;
                break;
            }
        }
        return isWidget;
    }
    getInitialState(): FormState {
        let { props } = this,
            { fields } = props,
            value = {};

        fields.forEach(field => {
            let { widget, widgetProps } = field;
            if (React.isValidElement(widget)) {
                widget = widget as JSX.Element;
                value[widget.props.name] = widget.props.value;
            } else if ( widgetProps ) {
                value[widgetProps.name] = widgetProps.value;
            }
        });
    
        return {
            isValid: props.isValid,
            value
        }
    }
    constructor(props: FormProps) {
        super(props);

        this.state = this.getInitialState();
        this.handleChange = this.handleChange.bind(this);
        this.handleWidgetMount = this.handleWidgetMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    private readonly widgets: any = [];
    render() {
        let { props, state } = this,
            { fields, children } = props;

        return (
            <FormContext.Provider value={{ onChange: this.handleChange, onWidgetMount: this.handleWidgetMount }}>
                <form className={tools.classNames(
                    cm.wrapper,
                    cm.isValid
                )} onSubmit={this.handleSubmit}>
                    {
                        this.renderFields(fields)
                    }
                </form>
            </FormContext.Provider>
        )
    }
    private renderFields(fields: FieldProps[]) {
        let { value } = this.state;

        return (
            <React.Fragment>
                {
                    fields.map((field: FieldProps, i) => {
                        let { widget, label, renderWidget, widgetProps } = field;
                        if (React.isValidElement(widget)) {
                            let { name } = widget.props as any;

                            if (value[name]) {
                                widget = React.cloneElement(widget as JSX.Element, {
                                    value: value[name],
                                });
                            }
                        } else {
                            if (widgetProps && widgetProps.name) 
                                widgetProps.value = value[widgetProps.name];
                        }
                        return (
                            <Field key={i} label={label} widget={widget} widgetProps={widgetProps} renderWidget={renderWidget}></Field>
                        )
                    })
                }
            </React.Fragment>
        )
    }
    componentDidUpdate(prevProps: FormProps, prevState: FormState) {
        let { isValid } = this.props,
            nextState: FormState = {...this.state};

        if (prevProps.isValid !== isValid) {
            nextState.isValid = isValid;
        }
        this.setState(nextState);
    }
    private handleWidgetMount(widgetInstance: any) {
        let { __isFormField } = widgetInstance.props;

        __isFormField && this.widgets.push(widgetInstance);
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
                        value: this.state.value,
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
    // TOOD 回调处理
    private handleChange(e: any) {
        let { onChange } = this.props, 
            { value } = this.state;

        value = { ...value };

        value[e.name] = e.value;

        this.setState({
            value
        }, () => {
            onChange && onChange({
                value: this.state.value
            });
        });
    }
}