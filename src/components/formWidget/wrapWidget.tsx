import FormWidget, { FormWidgetProps, MsgLevelType, FormWidgetValidEvent, FormWidgetState, FormWidgetChangeEvent, FormWidgetFocusEvent } from "./FormWidget";
import * as React from "react";
import cm from './FormWidget.scss';
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
const tools = Tools.getInstance();
interface State {
    isValid: boolean;
    msg?: string;
    msgLevel?: MsgLevelType;
}

export default function wrapWidget<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentClass<OriginProps>): React.ComponentClass<OriginProps> {
    type Props = OriginProps;

    return class WidgetWrapper extends React.PureComponent<Props, State> {
        // TODO defaultProps无法指定类型为Props
        static defaultProps: Partial<OriginProps> = {
            validateTrigger: 'onChange',
            ...UnwrappedComponent.defaultProps as any
        }
        readonly state: State;
        readonly widgetRef: React.RefObject<any>;
        constructor(props: Props) {
            super(props);

            this.state = {
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
                { isValid, msg, msgLevel } = state;

            return (
                <div className={cm.wrapper}>
                    <div className={cm['widget-control']}>
                        <UnwrappedComponent {...restProps} isValid={isValid} validateMsg={msg} validateMsgLevel={msgLevel} 
                            ref={this.widgetRef} 
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
            let { isValid, validateMsg, validateMsgLevel } = this.props,
                prevIsValid = prevProps.isValid;

            if (isValid !== undefined && isValid !== prevIsValid) {
                this.setState({ 
                    isValid: isValid as boolean,
                    msg: validateMsg,
                    msgLevel: validateMsgLevel,
                 });
            }
        }
        focus() {
            this.widgetRef.current.focus();
        }
        blur() {
            this.widgetRef.current.blur();
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