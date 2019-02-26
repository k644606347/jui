import * as React from "react";
import { ActiveFormContext, ActiveFormContextType } from "./ActiveFormContext";
import Widget, { FormWidgetChangeEvent, FormWidgetFocusEvent } from "./Widget";
import { AnyObject } from "../../utils/types";
import View from "../View";

export interface FieldProps {
    children: JSX.Element;
}
export type FieldChangeEvent = React.ChangeEvent<any> | FormWidgetChangeEvent;
export type FieldFocusEvent = FormWidgetFocusEvent | React.FocusEvent<any>;
export type FieldBlurEvent = FormWidgetFocusEvent | React.FocusEvent<any>;
class Field extends View<FieldProps>{
    static getInfoByFieldEvent(e: FieldChangeEvent | FieldFocusEvent | FieldBlurEvent) {
        let result: AnyObject = {
            eventType: e.type,
        };

        if (isWidgetEvent(e)) {// widget event
            result = {
                name: e.name,
                value: e.value,
                widgetName: e.widgetName,
            };
        } else {// dom event
            let target = e.target;

            result.name = target.name;

            if (target.nodeName === 'INPUT' && (target.type === 'checkbox' || target.type === 'radio')) {
                result.value = target.checked;
            } else {
                result.value = target.value;
            }
        }

        function isWidgetEvent(event: any): event is FormWidgetChangeEvent {
            return event.component === 'widget';
        }

        return result;
    }
    cssObject = {};
    private activeformContext: ActiveFormContextType;
    private fieldInstance: React.ReactInstance;
    constructor(props) {
        super(props);

        this.handleRef = this.handleRef.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    render() {
        let { props } = this,
            { children } = props;

        return (
            <ActiveFormContext.Consumer>
                {context => {
                    this.activeformContext = context;

                    let { value = {}, fieldReportMap = {} } = context,
                        originProps = children.props,
                        fieldName = originProps.name,
                        fieldReport = fieldReportMap[fieldName],
                        newProps: AnyObject = {
                            value: value[fieldName],
                            ref: this.handleRef,
                            onChange: this.handleChange,
                            onBlur: this.handleBlur,
                        }
                        if (Widget.isWidgetElement(children)) {
                            newProps.validateReport = fieldReport;
                        }
                        return React.cloneElement(children, newProps);
                }}
            </ActiveFormContext.Consumer>
        )
    }
    handleRef(component: React.ReactInstance) {
        this.fieldInstance = component;

        // console.log('handleRef',component);
        // let originalRef = (this.props.children as any).ref;
        // if (tools.isFunction(originalRef)) {
        //     originalRef(component);
        // } else if (tools.isPlainObject(originalRef) && originalRef.hasOwnProperty('current')) {
        //     originalRef.current = component;
        // }
    }
    componentDidMount() {
        if (this.activeformContext) {
            let { onFieldMount } = this.activeformContext,
                fieldInstance = this.fieldInstance;

            onFieldMount && fieldInstance && onFieldMount(fieldInstance);
        }
    }
    handleChange(e: FieldChangeEvent) {
        let childrenProps = this.props.children.props;

        childrenProps.onChange && childrenProps.onChange(e);

        if (this.activeformContext.onFieldChange) {
            this.activeformContext.onFieldChange(e);
        }
    }
    handleBlur(e: FieldBlurEvent) {
        let childrenProps = this.props.children.props;

        childrenProps.onBlur && childrenProps.onBlur(e);

        if (this.activeformContext.onFieldBlur) {
            this.activeformContext.onFieldBlur(e);
        }
    }
}

export default Field;