import * as React from "react";
import { FieldProps } from "./FieldType";
import cm from './Field.scss';
import Tools from '../utils/Tools';
import { FormContext } from "./FormContext";
import Label from "./Label";
import Form from "./Form";
import Log from "../utils/Log";
import Config from "./formWidget/Config";
const tools = Tools.getInstance();

export default class Field extends React.PureComponent<FieldProps, any> {
    constructor(props: FieldProps) {
        super(props);
    }
    render() {
        let { props } = this,
            { className, style, label, widget, renderWidget, render } = props;

        return (
            <FormContext.Consumer>
                {
                    (args) => {
                        let { onChange } = args,
                            widgetEl = this.processWidget(widget, onChange),
                            isWidgetEl = Form.isWidgetElement(widgetEl),
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
    private renderWidgetFail(msg: string) {
        Log.error(msg);
        return <div>{msg}</div>;
    }
    private processWidget(widget: JSX.Element | string, onChange: (...args: any[]) => void) {
        let { widgetProps } = this.props,
            widgetEl: JSX.Element,
            // tslint:disable-next-line:ban-types
            originOnChange: Function,
            injectedProps: any = {
                __isFormField: true,
                onChange(e: any) {
                    tools.isFunction(originOnChange) && originOnChange(e);
    
                    onChange && onChange(e);
                },
            };

        if (typeof widget === 'string') {
            let widgetConfig = Config[widget];

            if (!widgetConfig || !widgetConfig.widget) {
                return `<Field>渲染异常，没有widget为"${widget}"的配置`;
            }

            let widgetClass = widgetConfig.widget;

            if (widgetProps) {
                originOnChange = widgetProps.onChange;
                injectedProps = { ...widgetProps, ...injectedProps };
            }

            widgetEl = React.createElement(widgetClass, injectedProps);
        } else {
            if (!Form.isWidgetElement(widget)) {
                return `<Field>渲染异常，widget prop必须是Widget类型的React元素, 当前是: ${widget.type}`;
            }

            originOnChange = widget.props.onChange;
            widgetEl = React.cloneElement(widget, injectedProps);
        }
        
        return widgetEl;
    }
}