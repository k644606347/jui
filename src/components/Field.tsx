import * as React from "react";
import { FieldProps, FormWidgetMap } from "./FieldType";
import cm from './Field.scss';
import Tools from '../utils/Tools';

const tools = Tools.getInstance();
export default class Field extends React.PureComponent<FieldProps, any> {
    static OPTIONS_WIDGETS = ['checkbox', 'radio'];
    public static isField(field: any) {
        return (field as React.ReactElement<FieldProps>).type === Field;
    }
    widgetRef: React.RefObject<any>;
    constructor(props: FieldProps) {
        super(props);

        this.widgetRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleLabelClick = this.handleLabelClick.bind(this);
    }
    render() {
        let { props } = this,
            { label, widget, options, rules, renderWidget, style, className, ...restProps } = props,
            required = !!rules && rules.some(r => r.rule === 'required'),
            that = this,
            widgetComponent = FormWidgetMap[widget],
            widgetElement;

        if (!widgetComponent) {
            throw new Error(`不支持此widget的配置: ${widget}`);
        }

        widgetElement = React.createElement(widgetComponent, {
            ...restProps,
            ref: this.widgetRef,
            onChange(e: any) {
                that.handleChange(e);
            }
        });

        return (
            <div style={style} className={
                tools.classNames(
                    cm.wrapper,
                    className
                )
            }>
                <label className={cm.label} onClick={this.handleLabelClick}>{label}</label>
                <div className={cm['field-control']}>
                    <div className={cm['widget-control']}>
                    {
                        renderWidget ? renderWidget(widgetElement) : widgetElement
                    }
                    </div>
                    <div className={cm['rule-msg']}></div>
                </div>
            </div>
        );
    }
    // TOOD 回调处理
    handleChange(e: any) {
        let { onChange } = this.props;

        window.console.log('Field', e);
        onChange && onChange(e);
    }
    handleLabelClick() {
        let { current } = this.widgetRef;

        current && tools.isFunction(current.focus) && this.widgetRef.current.focus();
    }
    isOptionsWidget(widgetName: string) {
        return Field.OPTIONS_WIDGETS.indexOf(widgetName) !== -1;
    }
}