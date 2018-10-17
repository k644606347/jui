import { CSSAttrs } from "src/utils/types";
import * as React from "react";
import { ButtonProps } from "./ButtonType";
import modalCSS from './Modal.scss';
import Tools from "src/utils/Tools";
import Button from "./Button";

type func = (...args: any[]) => void;
export interface ModalProps extends CSSAttrs {
    title?: string | JSX.Element;
    show?: boolean;
    onOk?: func;
    onCancel?: func;
    onClose?: func;
    okBtn?: boolean | string | JSX.Element;
    cancelBtn?: boolean | string | JSX.Element;
    bodyClassName?: string;
    bodyStyle?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
}
export interface ModalState {}

const tools = Tools.getInstance();

// TODO Modal未完成
export default class Modal extends React.PureComponent<ModalProps, ModalState> {
    static defaultProps: Partial<ModalProps> = {
        title: '',
        show: false,
        okBtn: '确定',
        cancelBtn: '取消',
    };
    constructor(props: ModalProps) {
        super(props);

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    render() {
        let { props, state } = this,
            { children, title, show, className, bodyClassName, headerClassName, style, bodyStyle, headerStyle } = props;

        return (
            <div className={tools.classNames(modalCSS.wrapper, show && modalCSS.show, className)} style={style}>
                <div className={tools.classNames(modalCSS.header, headerClassName)} style={headerStyle}>
                    {this.buildBtnByType('okBtn')}
                    {<div>{title}</div>}
                    {this.buildBtnByType('cancelBtn')}
                </div>
                <div className={tools.classNames(modalCSS.header, bodyClassName)} style={bodyStyle}>
                    {children}
                </div>
            </div>
        );
    }
    private buildBtnByType(btnType: string): React.ReactNode {
            let btnHandlerMap = {
                okBtn: this.handleOk,
                cancelBtn: this.handleCancel,
            },
            btnHandler = btnHandlerMap[btnType],
            btnProp = this.props[btnType],
            btn;

        if (btnProp === false || btnProp === undefined || btnProp === null) {
            btn = '';
        } else if (React.isValidElement<any>(btnProp)) {
            let originEvent = btnProp.props.onClick,
                className = btnProp.props.className;
            
            btn = React.cloneElement(btnProp, {
                className: tools.classNames(className, modalCSS[btnType]),
                onClick: (e: any) => {
                    tools.isFunction(originEvent) && originEvent(e);

                    this[btnHandler](e);
                }
            });
        } else {
            btn = <Button className={modalCSS[btnType]} onClick={this[btnHandler]}>{ btnProp }</Button>
        }

        return btn;
    }
    private handleOk(e: React.MouseEvent) {
        let { onOk, onClose } = this.props;

        onOk && onOk(e);
        onClose && onClose(e);
    }
    private handleCancel(e: React.MouseEvent) {
        let { onCancel, onClose } = this.props;

        onCancel && onCancel(e);
        onClose && onClose(e);
    }
}