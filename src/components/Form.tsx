import * as React from "react";
import { FormProps, FormState } from "./FormType";
import Tools from "../utils/Tools";
import Field from "./Field";
import cm from './Form.scss';
import { FormContext } from "./FormContext";
import Config from "./formWidget/Config";
import { FieldProps } from "./FieldType";
import { Report } from "./formWidget/Validator";

const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, FormState> {
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
    constructor(props: FormProps) {
        super(props);

        this.state = {
            isValid: props.isValid,
            value: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleWidgetMount = this.handleWidgetMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    private readonly widgets: any = [];
    render() {
        let { props, state } = this,
            { fields, children } = props,
            { value, isValid } = state;

        return (
            <FormContext.Provider value={{ onChange: this.handleChange, onWidgetMount: this.handleWidgetMount }}>
                <form className={tools.classNames(
                    cm.wrapper,
                    cm.isValid
                )} onSubmit={this.handleSubmit}>
                    {
                        fields ? this.renderFields(fields) : children
                    }
                </form>
            </FormContext.Provider>
        )
    }
    private renderFields(fields: FieldProps[]) {
        return (
            <React.Fragment>
                {
                    fields.map((field: FieldProps, i) => {
                        let { widget, label, renderWidget, ...widgetProps } = field;
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
            nextState: FormState = {};

        if (prevProps.isValid !== isValid) {
            nextState.isValid = isValid;
        }
        this.setState(nextState);
    }
    private handleWidgetMount(widgetInstance: any) {
        this.widgets.push(widgetInstance);
    }
    submit() {
        let { onSubmit, onValid, onInvalid } = this.props,
            isValid = true;

        this.validate()
            .then((reports) => {
                this.validateReport(reports);
            })
            .catch((error) => {
                isValid = false;
                alert(error);
            })
            .finally(() => {
                this.setState({ isValid }, () => {
                    if (isValid) {
                        onValid && onValid();
                    } else {
                        onInvalid && onInvalid();
                    }
                    onSubmit && onSubmit();
                })
            })
    }
    validateReport(reports: Report[]) {
        let { widgets } = this;

        widgets.forEach((widget: any) => {
            let targetReport = reports.find(report => report.name === widget.props.name);

            targetReport && widget.validateReport(targetReport);
        });
    }
    validate(): Promise<any> {
        let isValid = true,
            invalidReports: Report[] = [],
            validCount = 0, invalidCount = 0,
            processor = (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
                this.widgets.forEach((widget: any) => {
                    widget.valdiate().then((report: Report) => {
                        if (!report.isValid) {
                            isValid = false;
                            invalidCount ++;
                            invalidReports.push(report);
                        } else {
                            validCount ++;
                        }
                    }).catch((e: Error) => {
                        let report: Report = {
                            name: widget.props.name,
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

        return new Promise(processor);
    }
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.submit();
    }
    // TOOD 回调处理
    private handleChange(e: any) {
        let { onChange } = this.props;
        //     { value } = this.state;

        // value = [...value];
        // let targetIndex = value.findIndex((v: any) => v.name === e.name),
        //     target;

        // if (targetIndex !== -1) {
        //     target = value[targetIndex];
        // }
        // if (target) {
        //     target.value = e.value;
        // } else {
        //     target = {
        //         name: e.name,
        //         value: e.value,
        //     }
        //     value.push(target);
        // }
        // this.setState({
        //     value
        // });
        onChange && onChange(e);
    }
}