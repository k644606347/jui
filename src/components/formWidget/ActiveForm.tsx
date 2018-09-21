// // import * as React from "react";

// import * as React from "react";
// import Tools from "../../utils/Tools";
// import { FormProps, FormState } from "../FormType";
// import Config from "./Config";
// import { FormContext } from "../FormContext";
// import { Field, Log } from "../..";
// import { Report } from "./Validator";
// import { FieldProps } from "../FieldType";

// export interface FormProps {
//     fields: FieldProps[];
//     onSubmit?: (e: any) => void;
//     onChange?: (e: any) => void;
//     onValid?: () => void;
//     onInvalid?: () => void;
//     isValid?: boolean;
//     // action: string;// TODO
//     // method: 'post' | 'get';
// }
// export interface FormState {
//     isValid?: boolean;
// }

// const tools = Tools.getInstance();
// class Form extends React.PureComponent<FormProps, FormState> {
//     readonly state: FormState;
//     static defaultProps: Partial<FormProps> = {
//         isValid: true
//     }
//     static isWidgetElement = (node: React.ReactNode) => {
//         let isWidget = false;
//         if (!React.isValidElement(node)) {
//             return false;
//         }
//         for (let key in Config) {
//             if (node.type === Config[key].widget) {
//                 isWidget = true;
//                 break;
//             }
//         }
//         return isWidget;
//     }
//     getInitialState(): FormState {
//         let { props } = this;
    
//         return {
//             isValid: props.isValid,
//         }
//     }
//     constructor(props: FormProps) {
//         super(props);

//         this.state = this.getInitialState();
//         this.handleChange = this.handleChange.bind(this);
//         this.handleWidgetMount = this.handleWidgetMount.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }
//     private readonly widgets: any = [];
//     render() {
//         let { props, state } = this,
//             { fields, children } = props;

//         return (
//             <FormContext.Provider value={{ onChange: this.handleChange, onWidgetMount: this.handleWidgetMount }}>
//                 <form className={tools.classNames(
//                     cm.wrapper,
//                     cm.isValid
//                 )} onSubmit={this.handleSubmit}>
//                     {
//                         this.renderFields(fields)
//                     }
//                 </form>
//             </FormContext.Provider>
//         )
//     }
//     private renderFields(fields: FieldProps[]) {
//         return (
//             <React.Fragment>
//                 {
//                     fields.map((field: FieldProps, i) => {
//                         let { widget, label, renderWidget, widgetProps } = field;
//                         return (
//                             <Field key={i} label={label} widget={widget} widgetProps={widgetProps} renderWidget={renderWidget}></Field>
//                         )
//                     })
//                 }
//             </React.Fragment>
//         )
//     }
//     componentDidUpdate(prevProps: FormProps, prevState: FormState) {
//         let { isValid } = this.props,
//             nextState: FormState = {...this.state};

//         if (prevProps.isValid !== isValid) {
//             nextState.isValid = isValid;
//         }
//         this.setState(nextState);
//     }
//     private handleWidgetMount(widgetInstance: any) {
//         this.widgets.push(widgetInstance);
//     }
//     getValue() {
//         let value = {};
//         this.widgets.forEach((w: any) => {
//             value[w.props.name] = w.getValue();
//         });

//         return value;
//     }
//     submit() {
//         let { onSubmit, onValid, onInvalid } = this.props,
//             isValid = true;

//         this.validate()
//             .catch((error) => {
//                 isValid = false;
//                 if (error instanceof Error) {
//                     Log.error(error);
//                     alert(error);
//                 } else {
//                     this.validateReport(error);
//                 }
//             })
//             .finally(() => {
//                 this.setState({ isValid }, () => {
//                     if (isValid) {
//                         onValid && onValid();
//                     } else {
//                         onInvalid && onInvalid();
//                     }
//                     onSubmit && onSubmit({
//                         value: this.getValue(),
//                     });
//                 })
//             })
//     }
//     validateReport(reports: Report[]) {
//         let { widgets } = this;

//         widgets.forEach((widget: any) => {
//             let targetReport = reports.find(report => report.fieldName === widget.props.name);

//             targetReport && widget.validateReport(targetReport);
//         });
//     }
//     validate(): Promise<any> {
//         let isValid = true,
//             invalidReports: Report[] = [],
//             validCount = 0, invalidCount = 0,
//             processor = (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
//                 this.widgets.forEach((widget: any) => {
//                     widget.validate().then((report: Report) => {
//                         if (!report.isValid) {
//                             isValid = false;
//                             invalidCount ++;
//                             invalidReports.push(report);
//                         } else {
//                             validCount ++;
//                         }
//                     }).catch((e: Error) => {
//                         let report: Report = {
//                             fieldName: widget.props.name,
//                             msg: e.message,
//                             isValid,
//                         };
//                         isValid = false;
//                         invalidCount ++;
//                         invalidReports.push(report)
//                     }).finally(() => {
//                         if (validCount + invalidCount < this.widgets.length) {
//                             return;
//                         }
//                         isValid ? resolve() : reject(invalidReports);
//                     });
//                 });
//             }

//         return new Promise(processor.bind(this));
//     }
//     private handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         e.stopPropagation();

//         this.submit();
//     }
//     private handleChange(e: any) {
//         let { onChange } = this.props;

//         onChange && onChange({ value: this.getValue() });
//     }
// }
// // export default class ActiveForm{
// //     static create(args: any) {
// //         class Form  extends React.PureComponent<any, any>  {

// //         }

// //         return Form;
// //     }
// // }