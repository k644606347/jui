import * as React from "react";
import { ActiveFormContext, ActiveFormContextType } from "./ActiveFormContext";
import Widget, { FormWidgetChangeEvent, FormWidgetFocusEvent } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";
import { AnyObject } from "../../utils/types";
import Tools from "../../utils/Tools";

export interface FieldProps {
    children: JSX.Element;
}
export type FieldChangeEvent = React.ChangeEvent<any> | FormWidgetChangeEvent | CheckboxChangeEvent | RadioChangeEvent;
export type FieldBlurEvent = FormWidgetFocusEvent | React.FocusEvent<any>;
const tools = Tools.getInstance();
class Field extends React.PureComponent<FieldProps>{
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
                        originValue = originProps.value,
                        hasOriginValue = originProps.hasOwnProperty('value'),
                        fieldReport = fieldReportMap[fieldName],
                        newProps: AnyObject = {
                            value: hasOriginValue ? originValue : (value[fieldName] || ''),
                            ref: this.handleRef,
                            onChange: this.handleChange,
                            onBlur: this.handleBlur,
                        }
                        if (Widget.isWidgetElement(children)) {
                            newProps.validateReport = fieldReport;
                        }
                        // console.log('isWidgetElement(children)', Widget.isWidgetElement(children));
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