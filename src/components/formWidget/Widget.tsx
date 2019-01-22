import * as React from "react";
import { CSSAttrs, AnyObject } from "../../utils/types";
import Tools from "../../utils/Tools";
import { validator, Report } from "../../validate/Validator";
import DataConvertor, { DataType } from "./stores/DataConvertor";

const tools = Tools.getInstance();

type ValueType = number | string | boolean | object;
interface FormWidgetEvent {
    id: string;
    name: string;
    value: ValueType;
    disabled: boolean;
    readOnly: boolean;
    focused: boolean;
    component: string;
    widgetName: string;
    type: string;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent {}
export interface FormWidgetMountEvent extends FormWidgetEvent {}
export interface FormWidgetFocusEvent extends FormWidgetEvent {}
export interface FormWidgetKeyboardEvent extends FormWidgetEvent {}

export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent extends FormWidgetEvent {
    report: Report
}

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: ValueType;
    autoFocus?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    validateReport?: Report;
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e: FormWidgetFocusEvent) => void;
    onBlur?: (e: FormWidgetFocusEvent) => void;
    // onKeyDown?(e: FormWidgetKeyboardEvent): void;
    // onKeyUp?(e: FormWidgetKeyboardEvent): void;
    // onKeyPress?(e: FormWidgetKeyboardEvent): void;
    onDidMount?: (e: FormWidgetMountEvent) => void;
    onWillUnmount?: (e: FormWidgetMountEvent) => void;
}
export interface FormWidgetState {
    focused: boolean;
    validating: boolean;
}
type Props = FormWidgetProps;
type State = FormWidgetState;
export default abstract class Widget<P extends Props = Props, S extends State = State> extends React.PureComponent<P, S> {
    static convertor = DataConvertor.getInstance();
    static validate(value: any): Promise<Report> {
        return Promise.resolve({...validator.getDefaultReport(), isValid: true});
    }
    static isWidgetElement(el: any): el is React.ComponentElement<Props, React.Component<Props>> {
        if (!React.isValidElement(el)) {
            return false;
        }

        let type = el.type;
        if (!tools.isFunction(type)) {
            return false;
        }

        let proto =  type.prototype,
            isWidget = false;

        while (proto !== null) {
            if (proto.constructor === Widget) {
                isWidget = true;
                break;
            } else
                proto =  Object.getPrototypeOf(proto);
        }
        
        return isWidget;
    }
    state: S;
    protected abstract dataType: DataType;
    protected abstract widgetName = 'widget';
    getInitialState(props: P): S {
        return {
            focused: !!props.autoFocus,
            validating: false,
        } as S;
    }
    constructor(props: P) {
        super(props);

        this.state = this.getInitialState(props);

        this.initChangeHandler();
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        // this.handleKeyDown = this.handleKeyDown.bind(this);
        // this.handleKeyUp =  this.handleKeyPress.bind(this);
        // this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    componentDidMount() {
        let { onDidMount } = this.props;

        onDidMount && onDidMount(this.buildEvent());
    }
    componentWillUnmount() {
        this.props.onWillUnmount && this.props.onWillUnmount(this.buildEvent());
    }
    getParsedValue() {
        return this.parseValue();
    }
    parseValue(value: any = this.props.value) {
        return this.getDataConvertor().convertTo(value, this.getDataType())
    }
    getDataConvertor() {
        return this.getClass().convertor;
    }
    getName() {
        return this.props.name || '';
    }
    getWidgetName() {
        return this.getClass().widgetName;
    }
    getDataType() {
        return this.dataType;
    }
    getClass(): any {
        return this.constructor;
    }
    isDisabled() {
        return !!this.props.disabled;
    }
    isReadOnly() {
        return !!this.props.readOnly;
    }
    protected handleFocus(e: React.FocusEvent) {
        let { onFocus } = this.props;

        this.setState({ focused: true }, () => {
            onFocus && onFocus(this.buildEvent());
        });
    }
    protected abstract handleChange(e: any): void;
    protected initChangeHandler() {
        let handler = this.handleChange.bind(this),
            proxyHandler = (...args: any[]) => {
                if (this.isDisabled() || this.isReadOnly()) {
                    return;
                }

                handler(...args);
            }
        this.handleChange = proxyHandler.bind(this);
    }
    protected handleBlur(e: React.FocusEvent) {
        let { onBlur } = this.props;

        this.setState({ focused: false }, () => {
            onBlur && onBlur(this.buildEvent());
        });
    }
    // protected handleKeyDown(e: React.KeyboardEvent) {
    //     let { onKeyDown } = this.props;

    //     onKeyDown && onKeyDown(this.buildEvent());
    // }
    // protected handleKeyUp(e: React.KeyboardEvent) {
    //     let { onKeyUp } = this.props;

    //     onKeyUp && onKeyUp(this.buildEvent());
    // }
    // protected handleKeyPress(e: React.KeyboardEvent) {
    //     let { onKeyPress } = this.props;

    //     onKeyPress && onKeyPress(this.buildEvent());
    // }
    protected buildEvent(rawEvent: AnyObject = {}): any {
        let { id = '', name = '', disabled = false, readOnly = false, value = this.getParsedValue() } = this.props,
            { focused } = this.state, 
            defaultEvent: FormWidgetEvent = {
                id,
                name,
                value,
                disabled,
                readOnly,
                focused,
                component: 'widget',
                widgetName: this.getWidgetName(),
                type: rawEvent.type,
            };

        return tools.isPlainObject(rawEvent) ? Object.assign(defaultEvent, rawEvent) : defaultEvent;
    }
}