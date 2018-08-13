import * as React from "react";
import { FieldProps } from "./FieldType";
import cssModules from './Field.scss';
import Tools from '../utils/Tools';

const tools = Tools.getInstance();
export default class Field extends React.PureComponent<FieldProps, any> {
    public static isField(field: any) {
        return (field as React.ReactElement<FieldProps>).type === Field;
    }
    constructor(props: FieldProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { label, widget, renderWidget, rules, style, className } = props,
            required = !!rules && rules.some(r => r.rule === 'required'),
            that = this;

        let originOnChange = widget.props.onChange,
            wrappedWidget = React.cloneElement(widget, {
            onChange(e: any) {
                originOnChange && originOnChange(e);
                that.handleChange(e);
            }
        });
        return (
            <div style={style} className={
                tools.classNames(
                    cssModules.wrapper,
                    required && cssModules.required,
                    className
                )
            }>
                <label className={cssModules.label}>{label}</label>
                <div className={cssModules['field-control']}>
                    <div className={cssModules['widget-control']}>
                        {
                            renderWidget ? renderWidget(wrappedWidget) : wrappedWidget
                        }
                    </div>
                    <div className={cssModules['rule-msg']}></div>
                </div>
            </div>
        )
    }
    // TOOD 回调处理
    handleChange(e: any) {
        let { onChange } = this.props;

        onChange && onChange(e);
    }
}