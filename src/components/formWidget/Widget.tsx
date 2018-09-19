import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
import DataConvertor, { DataType } from "./stores/DataConvertor";
import WidgetStore from "./stores/WidgetStore";
import { Log } from "../..";
import DefaultData from "./stores/DefaultData";

const tools = Tools.getInstance();
interface FormWidgetEvent {
    id?: string;
    name?: string;
    value?: any;
    checked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}
export interface FormWidgetChangeEvent extends FormWidgetEvent { }
export interface FormWidgetFocusEvent { }
export type MsgLevelType = 'error' | 'warn' | 'info';
export interface FormWidgetValidEvent {
    report: Report
}
type ValidateTrigger = 'onChange' | 'onBlur' | false;
const allowedInputElAttrs: Array<keyof React.InputHTMLAttributes<HTMLInputElement>> = [
    'id', 'name', 'value',  
    'disabled', 'readOnly', 'required', 
    'maxLength', 'minLength', 'placeholder', 
    'onChange', 'onFocus', 'onBlur'
];

export interface FormWidgetProps extends CSSAttrs {
    id?: string;
    name?: string;
    value?: any;
    focused?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    rules?: Rule[];
    validateTrigger?: ValidateTrigger;
    isValid?: boolean;
    validateMsg?: string;
    validateMsgLevel?: MsgLevelType;
    onChange?: (e: FormWidgetChangeEvent) => void;
    onFocus?: (e?: FormWidgetFocusEvent) => void;
    onBlur?: (e?: FormWidgetFocusEvent) => void;
    // onAfterInit?: (...args: any[]) => void;
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
    __isFormField?: boolean;
}
export interface FormWidgetState {
    dataType: DataType;
    prevPropsName: string;
    prevPropsValue: any;
    value: any;
}

const convertor = DataConvertor.getInstance();
export default abstract class Widget<P extends FormWidgetProps, S extends FormWidgetState> extends React.PureComponent<P, S> {
    static getDerivedStateFromProps(props: FormWidgetProps, state: FormWidgetState) {
        let { name, value } = props,
            nextState = null;

        if (name !== state.prevPropsName) {
            nextState = {
                dataType: state.dataType,
                prevPropsName: name,
                prevPropsValue: value,
                value: DefaultData.getBy(state.dataType)
            }
        } else {
            if (value !== state.prevPropsValue) {
                nextState = {
                    value: convertor.convertTo(value, state.dataType)
                }
            }
        }

        return nextState;
    }
    readonly dataType: DataType = 'string';
    state: S;
    getInitialState(props: P) {
        return {
            dataType: this.dataType,
            prevPropsName: props.name,
            prevPropsValue: props.value,
            value: convertor.convertTo(props.value, this.dataType),
        } as S;
    }
    constructor(props: P) {
        super(props);

        this.state = this.getInitialState(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validateReport = this.validateReport.bind(this);
    }
    setValue(value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let nextValue = convertor.convertTo(value, this.dataType);

            try {
                this.setState({
                    value: nextValue
                }, resolve.bind(this, nextValue));
            } catch(e) {
                Log.error(e);
                reject(e);
            }
        });
    }
    getValue() {
        return this.state.value;
    }
    protected handleChange(e?: any) {
        let { value } = e.target,
            { id, name, onChange } = this.props;

        this.setValue(value).then((val) => {
            onChange && onChange({
                id: id || '',
                name: name || '',
                value: val,
            });
        })
    }
    getClass(): any {
        return this.constructor;
    }
    protected handleFocus(e?: any) {
        let { onFocus } = this.props;

        onFocus && onFocus();
    }
    protected handleBlur(e?: any) {
        let { onBlur } = this.props;

        onBlur && onBlur();
    }
    protected getAllowedInputElAttrs(obj: any = this.props) {
        let inputElAttrs = {};

        for (let key in obj) {
            let val = obj[key];
        
            if (allowedInputElAttrs.indexOf(key as any) !== -1) {
                inputElAttrs[key] = val;
            }
        }

        return inputElAttrs;
    }
    protected getRules() {
        let { required, maxLength, minLength, rules } = this.props,
            ruleMap = {
                required,
                maxLength,
                minLength,
            },
            mixedRules: Rule[] = [];

        Object.keys(ruleMap).forEach(k => {
            let val = ruleMap[k];
            val !== undefined && mixedRules.push({
                rule: k,
                value: ruleMap[k],
            });
        });
        Object.assign(mixedRules, rules);

        return mixedRules;
    }
    async validate(value: any = this.getValue()): Promise<Report> {
        let promise = Validator.validate(value, this.getRules()),
            { name } = this.props;
            
        return promise.then(report => {
            if (name) {
                report.fieldName = name;
            }
            return report;
        });
    }
    protected validateReport(report: Report) {
        let { onValid, onInvalid } = this.props,
            { isValid } = report,
            event = {
                report
            };

        if (isValid) {
            onValid && onValid(event);
        } else {
            onInvalid && onInvalid(event);
        }
    }
}