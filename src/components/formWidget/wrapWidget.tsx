import FormWidget, { FormWidgetProps, MsgLevelType, FormWidgetValidEvent, FormWidgetState, FormWidgetChangeEvent, FormWidgetFocusEvent } from "./FormWidget";
import * as React from "react";
import cm from './FormWidget.scss';
import Tools from "../../utils/Tools";
import Validator, { Rule, Report } from "./Validator";
const tools = Tools.getInstance();
interface OwnProps {
    onValid?: (e: FormWidgetValidEvent) => void;
    onInvalid?: (e: FormWidgetValidEvent) => void;
}
interface State {
    isValid: boolean;
    msg?: string;
    msgLevel?: MsgLevelType;
}

export default function wrapWidget<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentClass<OriginProps>): React.ComponentClass<OriginProps & OwnProps> {
    // TODO 当OriginProps和OwnProps存在同名属性时，会导致属性类型冲突，比如{ a: string; } & { a: number; } 会变成{ a: string & number; } 这时为a赋值string或number都将报错
    type Props = OriginProps & OwnProps;

    return class WidgetWrapper extends React.PureComponent<Props, State> {
        // TODO defaultProps无法指定类型为Props
        // static defaultProps: any = {
        //     id: tools.genID('widget_')
        // }
        readonly state: State = {
            isValid: true,
            msg: '',
            msgLevel: 'error',
        }
        readonly widgetRef: React.RefObject<any>;
        constructor(props: Props) {
            super(props);

            this.widgetRef = React.createRef();

            this.handleChange = this.handleChange.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.handleLabelClick = this.handleLabelClick.bind(this);
            this.validateReport = this.validateReport.bind(this);
        }
        render() {
            let { props, state } = this,
                { id, onValid, onInvalid, ...restProps } = props as any,// TODO 此处必须转换为any，不然无法使用rest语法
                { msg, msgLevel } = state;

            return (
                <div className={cm.wrapper}>
                    <div className={cm['widget-control']}>
                        <UnwrappedComponent {...restProps} ref={this.widgetRef} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
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
        focus() {
            this.widgetRef.current.focus();
        }
        blur() {
            this.widgetRef.current.blur();
        }
        private handleChange(e: FormWidgetChangeEvent) {
            let { value } = e,
                { onChange } = this.props;

            onChange && onChange(e);
            this.validate(value!).then(this.validateReport);
        }
        private handleLabelClick(e: React.MouseEvent<HTMLLabelElement>) {
            let { widgetRef } = this;

            e.preventDefault();

            widgetRef && widgetRef.current && widgetRef.current.focus();
        }
        private handleFocus(e: FormWidgetFocusEvent) {
            let { onFocus } = this.props;

            onFocus && onFocus(e);
        }
        private handleBlur(e: FormWidgetFocusEvent) {
            let { onBlur } = this.props;

            onBlur && onBlur(e);
        }
        private async validate(value: string): Promise<Report> {
            let { required, maxLength, minLength, maxZhLength, minZhLength, rules } = this.props,
                ruleMap = {
                    required,
                    maxLength,
                    minLength,
                    maxZhLength,
                    minZhLength,
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

            return Validator.validate(value, mixedRules);
        }
        private validateReport(result: Report) {
            let { onValid, onInvalid } = this.props,
                { value, isValid, msg, hitRule, level } = result;

            if (result.isValid) {
                // render ok theme
            } else {
                // render fail theme
            }

            this.setState({
                isValid,
                msg,
                msgLevel: level
            }, () => {
                let event = {
                        value, hitRule, level, msg,
                    };
                if (isValid) {
                    onValid && onValid(event);
                } else {
                    onInvalid && onInvalid(event);
                }
            })
        }
    }
}