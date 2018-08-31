import * as React from "react";
import { FieldProps } from "./FieldType";
import cm from './Field.scss';
import Tools from '../utils/Tools';
import { FormContext } from "./Form-Context";
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
                        let widgetEl = this.processWidget(widget, args.onChange),
                            labelEl = label !== undefined ? <Label>{label}</Label> : undefined;
                        return (
                            <div style={style} className={
                                tools.classNames(
                                    cm.wrapper,
                                    className
                                )
                            }>
                            {
                                render ? 
                                    render(widgetEl, labelEl) : 
                                    <React.Fragment>
                                        { labelEl }
                                        {
                                            renderWidget ? renderWidget(widgetEl) : widgetEl
                                        }
                                    </React.Fragment>
                            }
                            </div>
                        );
                    }
                }
            </FormContext.Consumer>
        );
    }
    private processWidget(widget: JSX.Element | string, onChange: (...args: any[]) => void) {
        let { widgetProps } = this.props,
            widgetEl: JSX.Element,
            // tslint:disable-next-line:ban-types
            originOnChange: Function,
            injectedProps = {
                onChange(e: any) {
                    tools.isFunction(originOnChange) && originOnChange(e);
    
                    onChange && onChange(e);
                },
            };

        if (typeof widget === 'string') {
            let widgetClass = Config[widget].widget;
            
            if (!widgetClass)
                Log.throw(`<Field>渲染异常，没有widget为"${widget}"的配置`);

            if (widgetProps) {
                originOnChange = widgetProps.onChange;
                injectedProps = { ...widgetProps, ...injectedProps };
            }

            widgetEl = React.createElement(widgetClass, injectedProps);
        } else {
            if (!Form.isWidgetElement(widget)) {
                Log.throw(`<Field>渲染异常，widget prop必须是Widget类型的React元素, 当前是: ${widget.type}`);
            }

            originOnChange = widget.props.onChange;
            widgetEl = React.cloneElement(widget, injectedProps);
        }
        
        return widgetEl;
    }
}