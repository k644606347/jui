import { FormWidgetProps, MsgLevelType, FormWidgetValidEvent, FormWidgetState, FormWidgetChangeEvent, FormWidgetFocusEvent } from "./Widget";
import * as React from "react";
import cm from './Widget.scss';
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
const tools = Tools.getInstance();
interface State {
    focused?: boolean;
    isValid?: boolean;
    msg?: string;
    msgLevel?: MsgLevelType;
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
        constructor(props: Props) {
            super(props);

            this.state = {
                focused: props.focused || false,
                isValid: props.isValid || true,
                msg: props.validateMsg || '',
                msgLevel: props.validateMsgLevel || 'info',
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
                { focused, isValid, msg, msgLevel } = state;

            return (
                <div className={cm.wrapper}>
                    <div className={cm['widget-control']}>
                        <UnwrappedComponent {...restProps} ref={this.widgetRef}
                            isValid={isValid} validateMsg={msg} validateMsgLevel={msgLevel}
                            focused={focused}
                            onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}
                            onValid={this.handleValid} onInvalid={this.handleInvalid}
                        />
                    </div>
                    {
                        msg ?
                            <div className={
                                tools.classNames(
                                    cm['msg-control'],
                                    cm[`msg-${msgLevel}`]
                                )
                            }>{msg}</div> : ''
                    }
                </div>
            )
        }
        componentDidUpdate(prevProps: Props, prveState: State) {
            let { isValid, validateMsg, validateMsgLevel, focused } = this.props,
                nextState: State = {};

            if (isValid !== undefined && isValid !== prevProps.isValid) {
                nextState = {
                    ...nextState,
                    isValid: isValid,
                    msg: validateMsg,
                    msgLevel: validateMsgLevel
                };
            }

            if (focused !== undefined && focused !== prevProps.focused) {
                nextState.focused = focused;
            }

            this.setState(nextState);
        }
        focus() {
            this.setState({ focused: true });
        }
        blur() {
            this.setState({ focused: false });
        }
        validate() {
            this.widgetRef.current.validate();
        }
        private handleChange(e: FormWidgetChangeEvent) {
            let { value } = e,
                { onChange } = this.props,
                widgetObj = this.widgetRef.current;

            onChange && onChange(e);
            widgetObj.validate(value).then(widgetObj.validateReport);
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
            let { onValid } = this.props;

            this.setState({ isValid: true, msg: e.msg, msgLevel: 'info' }, () => {
                onValid && onValid(e);
            });
        }
        private handleInvalid(e: FormWidgetValidEvent) {
            let { onInvalid } = this.props;

            this.setState({ isValid: false, msg: e.msg, msgLevel: e.level }, () => {
                onInvalid && onInvalid(e);
            });
        }
    }
}