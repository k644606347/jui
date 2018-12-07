import * as React from "react";
import NavBar from "./NavBar";
import { CSSAttrs, NoResultFunction, AnyPlainObject } from "../utils/types";
import Tools from "../utils/Tools";
import { iconArrowBack, iconClose } from "./icons/SVGData";
import Icon from "./Icon";
import modalCSS from './Modal.scss';

type BtnType = boolean | string | JSX.Element;
export interface ModalProps extends CSSAttrs {
    title: string | JSX.Element;
    show: boolean;
    okBtn: BtnType;
    cancelBtn: BtnType;
    closeBtn: BtnType;
    onOk?: NoResultFunction;
    onCancel?: NoResultFunction;
    onClose?: NoResultFunction;
    leftContent?: string | React.ReactNode;
    rightContent?: string | React.ReactNode;
    bodyClassName?: string;
    bodyStyle?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
}
export interface ModalState {}

const tools = Tools.getInstance();
export default class Modal extends React.PureComponent<ModalProps, ModalState> {
    static defaultProps = {
        title: '',
        show: false,
        okBtn: '确定',
        cancelBtn: <Icon icon={iconArrowBack} />,
        closeBtn: false,
    };
    constructor(props: ModalProps) {
        super(props);

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    render() {
        let { props } = this,
            {
                children, title, show,
                okBtn, cancelBtn, closeBtn,
                leftContent, rightContent,
                className, bodyClassName, headerClassName, 
                style, bodyStyle, headerStyle 
            } = props;

        if (closeBtn === true) {
            closeBtn = <Icon icon={iconClose} />;
        }
        return (
            <div className={tools.classNames(modalCSS.wrapper, show && modalCSS.show, className)} style={style}>
                <NavBar 
                    className={tools.classNames(modalCSS.header, headerClassName)} 
                    style={headerStyle} 
                    leftContent={
                        leftContent ? 
                            leftContent : 
                            <React.Fragment>
                                {
                                    this.buildBtn(cancelBtn, {
                                        onClick: this.handleCancel,
                                        className: modalCSS.cancelBtn,
                                    })
                                }
                                {
                                    this.buildBtn(closeBtn, {
                                        onClick: this.handleClose,
                                        className: modalCSS.closeBtn,
                                    })
                                }
                            </React.Fragment>
                    } 
                    rightContent={
                        rightContent ? 
                            rightContent : 
                            this.buildBtn(okBtn, {
                                onClick: this.handleOk,
                                className: modalCSS.okBtn
                            })
                    }
                >
                    {<div className={modalCSS.title}>{title}</div>}
                </NavBar>
                <div className={tools.classNames(modalCSS.body, bodyClassName)} style={bodyStyle}>
                    {children}
                </div>
            </div>
        );
    }
    private buildBtn(btn: BtnType, btnProps: AnyPlainObject) {
        if (!btn) {
            return '';
        } else {
            return React.createElement('div', btnProps, btn);
        }
    }
    private handleOk(e: React.MouseEvent) {
        let { onOk } = this.props;

        onOk && onOk(e);
    }
    private handleCancel(e: React.MouseEvent) {
        let { onCancel } = this.props;

        onCancel && onCancel(e);
    }
    private handleClose(e: React.MouseEvent) {
        let { onClose } = this.props;

        onClose && onClose(e);
    }
}