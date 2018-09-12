import { FormWidgetProps, MsgLevelType, FormWidgetValidEvent, FormWidgetState, FormWidgetChangeEvent, FormWidgetFocusEvent } from "./Widget";
import * as React from "react";
import cm from './Widget.scss';
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
import Log from "../../utils/Log";
import { FormContext } from "../FormContext";
const tools = Tools.getInstance();
interface State {
    focused?: boolean;
    isValid?: boolean;
    validateMsg?: string;
    validateMsgLevel?: MsgLevelType;
}

export default function wrapWidget<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentClass<OriginProps>): React.ComponentClass<OriginProps> {
    type Props = OriginProps;

    return class WidgetWrapper extends React.PureComponent<Props, State> {
        static defaultProps: Partial<Props> = {
            validateTrigger: 'onChange',
            ...UnwrappedComponent.defaultProps as any
        }
        readonly state: State;
        readonly widgetRef: React.RefObject<any>;
        formContext: any;
        constructor(props: Props) {
            super(props);

            this.state = {
                focused: props.focused || false,
                isValid: props.isValid || true,
                validateMsg: props.validateMsg || '',
                validateMsgLevel: props.validateMsgLevel || 'info',
            }
            this.widgetRef = React.createRef();

            this.handleChange = this.handleChange.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.handleValid = this.handleValid.bind(this);
            this.handleInvalid = this.handleInvalid.bind(this);
        }
        render() {
            let { props, state } = this,
                { ...restProps } = props as any,// TODO 此处必须转换为any，不然无法使用rest语法
                { focused, isValid, validateMsg, validateMsgLevel } = state;

            return (
                <FormContext.Consumer>
                    {
                        context => {
                            this.formContext = context;
                            return <div className={cm.wrapper}>
                                <div className={cm['widget-control']}>
                                    <UnwrappedComponent {...restProps} ref={this.widgetRef}
                                        isValid={isValid} validateMsg={validateMsg} validateMsgLevel={validateMsgLevel}
                                        focused={focused}
                                        onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}
                                        onValid={this.handleValid} onInvalid={this.handleInvalid}
                                    />
                                </div>
                                {
                                    validateMsg ?
                                        <div className={
                                            tools.classNames(
                                                cm['msg-control'],
                                                cm[`msg-${validateMsgLevel}`]
                                            )
                                        }>{validateMsg}</div> : ''
                                }
                            </div>
                        }
                    }
                </FormContext.Consumer>
            )
        }
        componentDidMount() {
            let { formContext } = this;
            
            if (formContext) {
                let { onWidgetMount } = formContext;

                onWidgetMount && onWidgetMount(this);
            }
        }
        componentDidUpdate(prevProps: Props, prveState: State) {
            let { isValid, validateMsg, validateMsgLevel, focused } = this.props,
                nextState: State = {};

            if (isValid !== undefined && isValid !== prevProps.isValid) {
                nextState = {
                    ...nextState,
                    isValid: isValid,
                    validateMsg: validateMsg,
                    validateMsgLevel: validateMsgLevel
                };
            }

            if (focused !== undefined && focused !== prevProps.focused) {
                nextState.focused = focused;
            }

            this.setState(nextState);
        }
        validate() {
            return this.widgetRef.current.validate();
        }
        validateReport(report: Report) {
            return this.widgetRef.current.validateReport(report);
        }
        private validatePromise: Promise<Report>;
        private validateTimer: number;
        private handleChange(e: FormWidgetChangeEvent) {
            let { value, checked } = e,
                { onChange } = this.props,
                widgetObj = this.widgetRef.current;

                window.clearTimeout(this.validateTimer);
                this.validateTimer = window.setTimeout(() => {
                    let promise: Promise<any>;

                    onChange && onChange(e);
                    if (checked === false) {// checkbox / radio
                        value = '';
                    }
                    promise = this.validatePromise = widgetObj.validate(value)
                        .then((report: Report) => {
                            if (this.validatePromise === promise) {
                                widgetObj.validateReport(report);
                            }
                        });
                }, 20);
        }
        private handleFocus(e: FormWidgetFocusEvent) {
            let { onFocus } = this.props;

            onFocus && onFocus(e);
        }
        private handleBlur(e: FormWidgetFocusEvent) {
            let { onBlur } = this.props;

            onBlur && onBlur(e);
        }
        private handleValid(e: FormWidgetValidEvent) {
            let { onValid } = this.props,
                { report } = e;

            this.setState({ isValid: true, validateMsg: report.msg, validateMsgLevel: 'info' }, () => {
                onValid && onValid(e);
            });
        }
        private handleInvalid(e: FormWidgetValidEvent) {
            let { onInvalid } = this.props,
                { report } = e;

            this.setState({ isValid: false, validateMsg: report.msg, validateMsgLevel: report.level }, () => {
                onInvalid && onInvalid(e);
            });
        }
    }
}