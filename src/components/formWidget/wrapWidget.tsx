import Widget, { FormWidgetProps, MsgLevelType, FormWidgetValidEvent, FormWidgetState, FormWidgetChangeEvent, FormWidgetFocusEvent } from "./Widget";
import * as React from "react";
import cm from './wrapWidget.scss';
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
import Log from "../../utils/Log";
import { FormContext } from "./FormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";
const tools = Tools.getInstance();

interface ExtraProps {
    forwardedRef?: React.RefObject<any>;
}
interface State {
    focused?: boolean;
    isValid?: boolean;
    validateMsg?: string;
    validateMsgLevel?: MsgLevelType;
}

export default function wrapWidget<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & ExtraProps;

    class WidgetWrapper extends React.PureComponent<Props, State> {
        static defaultProps: Partial<Props> = {
            validateTrigger: 'onChange',
            ...UnwrappedComponent.defaultProps as any
        }
        private formContext: any;
        private widgetInstance: Widget<OriginProps, any> & React.Component;
        readonly state: State;
        constructor(props: Props) {
            super(props);

            this.state = {
                focused: props.focused || false,
                isValid: props.isValid || true,
                validateMsg: props.validateMsg || '',
                validateMsgLevel: props.validateMsgLevel || 'info',
            }

            this.handleChange = this.handleChange.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.handleValid = this.handleValid.bind(this);
            this.handleInvalid = this.handleInvalid.bind(this);
        }
        render() {
            let { props, state } = this,
                { forwardedRef, ...restProps } = props as any,// TODO 此处必须转换为any，不然无法使用rest语法
                { focused, isValid, validateMsg, validateMsgLevel } = state;

            return (
                <FormContext.Consumer>
                    {
                        context => {
                            this.formContext = context;
                            return <div className={cm.wrapper}>
                                <div className={cm['widget-control']}>
                                    <UnwrappedComponent {...restProps} 
                                        ref={(component) => {
                                            if (!component) {
                                                return;
                                            }
                                            
                                            this.widgetInstance = component as any;
                                            if (forwardedRef)
                                                forwardedRef.current = component;
                                        }}
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
        componentDidMount() {
            if (this.formContext) {
                let { onWidgetMount } = this.formContext;

                onWidgetMount && onWidgetMount(this.widgetInstance);
            }
        }
        private handleChange(e: FormWidgetChangeEvent) {
            let { name, id, onChange} = this.props,
                { widgetInstance } = this,
                mixedEvent: FormWidgetChangeEvent = {
                    ...e,
                    name, id
                };

                if (widgetInstance.isDisabled() || widgetInstance.isReadOnly()) {
                    return;
                }

                if (this.formContext) {
                    let { onWidgetChange } = this.formContext;
    
                    onWidgetChange && onWidgetChange(this.widgetInstance);
                }

                onChange && onChange(mixedEvent);

                if (widgetInstance.getValidateTriggers().indexOf('onChange') !== -1)
                    this.dispatchValidation();
        }
        private validatePromise: Promise<any>;
        private validateTimer: number;
        private dispatchValidation() {
            let { widgetInstance } = this;

            window.clearTimeout(this.validateTimer);
            this.validateTimer = window.setTimeout(() => {
                let promise: Promise<any> = this.validatePromise = widgetInstance.validate()
                    .then((report: Report) => {
                        if (this.validatePromise === promise) {
                            widgetInstance.validateReport(report);
                        }
                    });
            }, 100);
        }
        private handleFocus(e: FormWidgetFocusEvent) {
            let { onFocus } = this.props;

            onFocus && onFocus(e);
        }
        private handleBlur(e: FormWidgetFocusEvent) {
            let { onBlur } = this.props,
                { widgetInstance } = this;

            onBlur && onBlur(e);

            if (widgetInstance.getValidateTriggers().indexOf('onBlur') !== -1)
                this.dispatchValidation();
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

    let HoistedComponent = hoistNonReactStatics(WidgetWrapper, UnwrappedComponent) as React.ComponentClass<Props>;

    return React.forwardRef((props: Props, ref: React.RefObject<any>) => 
            <HoistedComponent {...props} forwardedRef={ref} />);
}