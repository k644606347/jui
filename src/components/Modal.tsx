import * as React from "react";
import NavBar from "./NavBar";
import { CSSAttrs, NoResultFunction } from "../utils/types";
import Tools from "../utils/Tools";
import modalCSS from './Modal.scss';
export interface ModalProps extends CSSAttrs {
    title?: string | JSX.Element;
    show?: boolean;
    onOk?: NoResultFunction;
    onCancel?: NoResultFunction;
    onClose?: NoResultFunction;
    okBtn?: boolean | string | JSX.Element;
    cancelBtn?: boolean | string | JSX.Element;
    bodyClassName?: string;
    bodyStyle?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
}
export interface ModalState {}

const tools = Tools.getInstance();

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
        let { props } = this,
            { children, title, show, className, okBtn, cancelBtn, bodyClassName, headerClassName, style, bodyStyle, headerStyle } = props;

        return (
            <div className={tools.classNames(modalCSS.wrapper, show && modalCSS.show, className)} style={style}>
                <NavBar 
                    className={tools.classNames(modalCSS.header, headerClassName)} style={headerStyle}
                    rightContent={okBtn} onRightClick={this.handleOk}
                    leftContent={cancelBtn} onLeftClick={this.handleCancel}
                >
                    {<div className={modalCSS.title}>{title}</div>}
                </NavBar>
                <div className={tools.classNames(modalCSS.body, bodyClassName)} style={bodyStyle}>
                    {children}
                </div>
            </div>
        );
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