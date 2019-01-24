import * as React from "react";
import Tools from '../utils/Tools';
import Label, { LabelProps } from "./Label";
import { CSSAttrs } from "../utils/types";
import formItemCSS from './FormItem.scss';
import { ActiveFormContext } from "./formWidget/ActiveFormContext";
import Field, { FieldProps } from "./formWidget/Field";
import View from "./View";

interface RenderChildrenEvent {
    component: React.ComponentElement<FieldProps, Field>;
    label?: React.ComponentElement<LabelProps, Label>;
}
export interface FormItemProps extends CSSAttrs {
    field: JSX.Element;
    label?: any;
    children?(e: RenderChildrenEvent): React.ReactNode;
    layout?: 'vertical' | 'horizontal';
}

const tools = Tools.getInstance();
export default class FormItem extends View<FormItemProps> {
    static defaultProps = {
        componentProps: {},
        layout: 'horizontal',
    }
    private activeFormContext;
    constructor(props: FormItemProps) {
        super(props);
    }
    render() {
        let { props } = this,
            { className, style, label, field: field, layout, children } = props,
            fieldNode = field;

        if (fieldNode.type !== Field) {
            fieldNode = <Field>{fieldNode}</Field>;
        }
        return (
            <ActiveFormContext.Consumer>{
                context => {
                    this.activeFormContext = context;

                    let labelNode;
                    if (label === undefined || label === null || label === false) {
                        labelNode = '';
                    } else {
                        let required = this.isRequired();
                        labelNode = <Label required={required} className={formItemCSS.label}>{label}</Label>;
                    }

                    return (
                        <div style={style} 
                            className={tools.classNames(
                                formItemCSS.wrapper,
                                className,
                                layout && formItemCSS[layout],
                            )}
                        >
                            {
                                children ? 
                                    children({
                                        component: fieldNode as RenderChildrenEvent['component'],
                                        label: labelNode,
                                    }) : 
                                    <React.Fragment>
                                        { labelNode }
                                        <div className={formItemCSS.formitemControl}>
                                        { fieldNode }
                                        </div>
                                    </React.Fragment>
                            }
                        </div>
                    )
                }
            }</ActiveFormContext.Consumer>
        );
    }
    private isRequired() {
        let { field } = this.props,
            fieldName = field.props.name || '',
            { validateRules = {} } = this.activeFormContext,
            fieldRule = validateRules[fieldName],
            required;

        if (Array.isArray(fieldRule)) {
            required = !!fieldRule.find(rule => rule.type === 'required');
        } else if (tools.isPlainObject(fieldRule)) {
            required = fieldRule.type === 'required';
        } else {
            required = false;
        }

        return required;
    }
}