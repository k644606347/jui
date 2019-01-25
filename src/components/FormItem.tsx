import * as React from "react";
import Tools from '../utils/Tools';
import Label, { LabelProps } from "./Label";
import { CSSAttrs } from "../utils/types";
import formItemCSS from './FormItem.scss';
import { ActiveFormContext } from "./formWidget/ActiveFormContext";
import Field, { FieldProps, FieldFocusEvent, FieldBlurEvent } from "./formWidget/Field";
import View from "./View";

interface RenderChildrenEvent {
    component: React.ComponentElement<FieldProps, Field> & Field;
    label?: React.ComponentElement<LabelProps, Label> & Label;
}
export interface FormItemProps extends CSSAttrs {
    field: JSX.Element;
    label?: any;
    children?(e: RenderChildrenEvent): React.ReactNode;
    layout?: 'vertical' | 'horizontal';
    floatingLabel?: boolean;
}

export interface FormItemState {
    fieldFocused: boolean;
    fieldValue: any;
}

const tools = Tools.getInstance();
export default class FormItem extends View<FormItemProps, FormItemState> {
    static defaultProps = {
        componentProps: {},
        layout: 'horizontal',
    }
    private activeFormContext;
    constructor(props: FormItemProps) {
        super(props);

        let { field } = this.props;

        this.state = {
            fieldFocused: !!field.props.autoFocus,
            fieldValue: field.props.value || '',
        };
        this.handleFieldFocus = this.handleFieldFocus.bind(this);
        this.handleFieldBlur = this.handleFieldBlur.bind(this);
    }
    render() {
        let { props, state } = this,
            { className, style, label, field, floatingLabel, layout, children } = props,
            { fieldFocused, fieldValue } = state,
            fieldNode = field;

        if (floatingLabel) {
            layout = 'vertical';
            fieldNode = React.cloneElement(fieldNode, {
                onFocus: this.handleFieldFocus,
                onBlur: this.handleFieldBlur,
            });
        }
        fieldNode = <Field>{fieldNode}</Field>;
        return (
            <ActiveFormContext.Consumer>{
                context => {
                    this.activeFormContext = context;

                    let labelNode;
                    if (label === undefined || label === null || label === false) {
                        labelNode = '';
                    } else {
                        let required = this.isRequired(),
                            classList = [formItemCSS.label];

                        if (floatingLabel) {
                            classList.push(formItemCSS.floatingLabel);
                            if (fieldFocused || fieldValue !== '') {
                                classList.push(formItemCSS.fieldFocused);
                            }
                        }
                        labelNode = <Label required={required} className={tools.classNames(classList)}>{label}</Label>;
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
    handleFieldFocus(e: FieldFocusEvent) {
        let info = Field.getInfoByFieldEvent(e);

        this.setState({ fieldFocused: true, fieldValue: info.value });
    }
    handleFieldBlur(e: FieldBlurEvent) {
        let info = Field.getInfoByFieldEvent(e);
        this.setState({ fieldFocused: false, fieldValue: info.value });
    }
}