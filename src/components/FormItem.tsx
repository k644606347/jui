import * as React from "react";
import cm from './FormItem.scss';
import Tools from '../utils/Tools';
import Label from "./Label";
import Config, { FormWidgetName } from "./formWidget/Config";
import { CSSAttrs } from "src/utils/types";
import { FormWidgetProps } from "./formWidget/Widget";
const tools = Tools.getInstance();

export interface FormItemProps extends CSSAttrs {
    label?: JSX.Element | string;
    component: JSX.Element | FormWidgetName | string;
    render?: (component: JSX.Element | string, label?: JSX.Element | string) => React.ReactNode;
    // componentProps?: { [key in keyof FormWidgetProps]: any};
    componentProps?: {[k in string]: any};
    layout?: 'vertical' | 'horizontal';
}

export default class FormItem extends React.PureComponent<FormItemProps, any> {
    static isWidgetElement = (node: React.ReactNode): node is React.ReactElement<FormWidgetProps> => {
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
    static defaultProps: Partial<FormItemProps> = {
        layout: 'horizontal',
    }
    constructor(props: FormItemProps) {
        super(props);
    }
    render() {
        let { props } = this,
            { className, style, label, component, render, layout } = props,
            componentNode: JSX.Element | string;

        if (tools.isString(component)) {
            if (Config[component]) {
                componentNode = this.buildWidgetByName(component);
            } else {
                componentNode = component;
            }
        } else {
            componentNode = component;
        }

        let required, labelNode;
        if (React.isValidElement(componentNode)) {
            // tslint:disable-next-line:no-string-literal
            required = componentNode.props['required'];
        }
        if (label !== undefined) {
            labelNode = Label.isLabelElement(label) ? 
                React.cloneElement(label, {
                    className: cm.label,
                    required,
                }) : 
                <Label required={required} className={cm.label}>{label}</Label>;
        } else {
            labelNode = '';
        }

        return (
            <div style={style} className={
                tools.classNames(
                    cm.wrapper,
                    className,
                    layout && cm[layout],
                )
            }>
            {
                render ? 
                    render(componentNode, labelNode) : 
                    <React.Fragment>
                        { labelNode }
                        <div className={cm.formitemControl}>
                        { componentNode }
                        </div>
                    </React.Fragment>
            }
            </div>
        );
    }
    private buildWidgetByName(widgetName: string) {
        let { componentProps } = this.props,
            widgetEl: JSX.Element,
            injectedProps: any = {},
            widgetConfig = Config[widgetName];

        let widgetClass = widgetConfig.widget;

        if (componentProps) {
            injectedProps = { ...componentProps, ...injectedProps };
        }

        widgetEl = React.createElement(widgetClass, injectedProps);
        
        return widgetEl;
    }
}