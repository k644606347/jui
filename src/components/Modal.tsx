import * as React from "react";
import NavBar from "./NavBar";
import { CSSAttrs, NoResultFunction, AnyObject } from "../utils/types";
import { iconArrowBack, iconClose } from "./icons/SVGData";
import Icon from "./Icon";
import modalCSS from './Modal.scss';
import ScrollView from "./ScrollView";
import View from "./View";
import Button from "./Button";
import { tools } from "../utils/Tools";

let cssModules = tools.useCSS(modalCSS);

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
export default class Modal extends React.PureComponent<ModalProps, ModalState> {
    cssObject = modalCSS;
    static defaultProps = {
        title: '',
        show: false,
        okBtn: '确定',
        cancelBtn: <Icon icon={iconArrowBack} />,
        closeBtn: false,
    };
    private disableScrollTaskID;
    private scrollViewRef = React.createRef<ScrollView>();
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
            <div className={tools.classNames(cssModules.wrapper, show && cssModules.show, className)} style={style}>
                <NavBar 
                    className={tools.classNames(cssModules.header, headerClassName)} 
                    style={headerStyle} 
                    leftContent={
                        leftContent ? 
                            leftContent : 
                            <React.Fragment>
                                {
                                    this.buildBtn(cancelBtn, {
                                        onClick: this.handleCancel,
                                        className: cssModules.cancelBtn,
                                    })
                                }
                                {
                                    this.buildBtn(closeBtn, {
                                        onClick: this.handleClose,
                                        className: cssModules.closeBtn,
                                    })
                                }
                            </React.Fragment>
                    } 
                    rightContent={
                        rightContent ? 
                            rightContent : 
                            this.buildBtn(okBtn, {
                                onClick: this.handleOk,
                                className: cssModules.okBtn
                            })
                    }
                >
                    {<div className={cssModules.title}>{title}</div>}
                </NavBar>
                <ScrollView ref={this.scrollViewRef} className={tools.classNames(cssModules.body, bodyClassName)} style={bodyStyle}>
                    {children}
                </ScrollView>
            </div>
        );
    }
    componentDidMount() {
        this.processScroll();
    }
    componentDidUpdate() {
        this.processScroll();
    }
    private processScroll() {
        if (this.props.show) {
            if (!this.disableScrollTaskID)
                this.disableScrollTaskID = ScrollView.addDisableTask((scrollView) => scrollView !== this.scrollViewRef.current);
        } else {
            ScrollView.removeDisableTask(this.disableScrollTaskID);
            this.disableScrollTaskID = null;
        }
    }
    private buildBtn(btn: BtnType, btnProps: AnyObject) {
        if (btn === false) {
            return '';
        } else if (React.isValidElement(btn)) {
            return React.cloneElement(btn, btnProps);
        } else {
            return React.createElement(Button, { ...btnProps, clear: true, type: 'primary' }, btn);
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