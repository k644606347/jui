import * as React from "react";
import { FieldProps } from "./FieldType";
import cm from './Field.scss';
import Tools from '../utils/Tools';
import { FormContext } from "./FormContext";
import Label from "./Label";
import Form from "./Form";
import Log from "../utils/Log";
import Config from "./formWidget/Config";
import Message from "./Message";
const tools = Tools.getInstance();

export default class Field extends React.PureComponent<FieldProps, any> {
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
    private widgetRef: React.RefObject<any>;
    private formContext: any;
    constructor(props: FieldProps) {
        super(props);

        this.widgetRef = React.createRef();
    }
    render() {
        let { props } = this,
            { className, style, label, widget, renderWidget, render } = props;

        return (
            <FormContext.Consumer>
                {
                    (args) => {
                        this.formContext = args;
                        
                        let widgetEl = this.processWidget(widget),
                            isWidgetEl = Field.isWidgetElement(widgetEl),
                            { required } = (widgetEl as React.ReactElement<any>).props,
                            labelEl = label !== undefined ? <Label required={required} className={cm.label}>{label}</Label> : undefined;

                        return (
                            <div style={style} className={
                                tools.classNames(
                                    cm.wrapper,
                                    className
                                )
                            }>
                            {
                                isWidgetEl ? 
                                        render ? 
                                            render(widgetEl as JSX.Element, labelEl) : 
                                            <React.Fragment>
                                                { labelEl }
                                                <div className={cm['field-control']}>
                                                {
                                                    renderWidget ? renderWidget(widgetEl as JSX.Element) : widgetEl
                                                }
                                                </div>
                                            </React.Fragment>
                                    : this.renderWidgetFail(widgetEl as string)
                            }
                            </div>
                        );
                    }
                }
            </FormContext.Consumer>
        );
    }
    componentDidMount() {
        let { onWidgetMount } = this.formContext,
            { widgetRef } = this;

        tools.isFunction(onWidgetMount) && onWidgetMount(widgetRef.current);
    }
    private renderWidgetFail(msg: string) {
        Log.error(msg);
        return <Message type="error">{msg}</Message>;
    }
    private processWidget(widgetName: string) {
        let { widgetProps } = this.props,
            { widgetRef, formContext } = this,
            widgetEl: JSX.Element,
            // tslint:disable-next-line:ban-types
            originOnChange: Function,
            injectedProps: any = {
                ref: widgetRef,
                onChange(e: any) {
                    tools.isFunction(originOnChange) && originOnChange(e);
                    
                    let { onChange } = formContext;
                    tools.isFunction(onChange) && onChange(e);
                },
            },
            widgetConfig = Config[widgetName];

        if (!widgetConfig || !widgetConfig.widget) {
            return `<Field>渲染异常，没有widget为"${widgetName}"的配置`;
        }

        let widgetClass = widgetConfig.widget;

        if (widgetProps) {
            originOnChange = widgetProps.onChange;
            injectedProps = { ...widgetProps, ...injectedProps };
        }

        widgetEl = React.createElement(widgetClass, injectedProps);
        
        return widgetEl;
    }
}