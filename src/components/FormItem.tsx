import * as React from "react";
import { FormItemProps } from "./FormItemType";
import cm from './FormItem.scss';
import Tools from '../utils/Tools';
import Label from "./Label";
import Log from "../utils/Log";
import Config from "./formWidget/Config";
import Message from "./Message";
const tools = Tools.getInstance();

export default class FormItem extends React.PureComponent<FormItemProps, any> {
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
    constructor(props: FormItemProps) {
        super(props);
    }
    render() {
        let { props } = this,
            { className, style, label, widget, renderWidget, render } = props;

        let widgetEl = this.processWidget(widget),
                        isWidgetEl = FormItem.isWidgetElement(widgetEl),
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
                                <div className={cm['formitem-control']}>
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
    private renderWidgetFail(msg: string) {
        Log.error(msg);
        return <Message type="error">{msg}</Message>;
    }
    private processWidget(widgetName: string) {
        let { widgetProps } = this.props,
            widgetEl: JSX.Element,
            injectedProps: any = {},
            widgetConfig = Config[widgetName];

        if (!widgetConfig || !widgetConfig.widget) {
            return `<FormItem>渲染异常，没有widget为"${widgetName}"的配置`;
        }

        let widgetClass = widgetConfig.widget;

        if (widgetProps) {
            injectedProps = { ...widgetProps, ...injectedProps };
        }

        widgetEl = React.createElement(widgetClass, injectedProps);
        
        return widgetEl;
    }
}