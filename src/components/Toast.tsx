import { CSSAttrs } from "../utils/types";
import * as React from "react";
import toastCSS from './Toast.scss';
import Tools from "src/utils/Tools";
import { iconInfo, iconSpinner, iconCheckCircle_r, iconTimesCircle_r, iconExclamationCircle } from "./icons/FontAwesomeMap";
import Icon, { IconProps } from "./Icon";

export interface ToastProps extends CSSAttrs {
    duration?: number;
    onClose?: () => void;
    overlay?: boolean;
    type?: 'info' | 'loading' | 'success' | 'error' | 'warn';
    icon?: React.ReactElement<IconProps>;
    children?: React.ReactNode;
}
const presetIconMap = {
    info: iconInfo,
    loading: iconSpinner,
    success: iconCheckCircle_r,
    error: iconTimesCircle_r,
    warn: iconExclamationCircle
}
const tools = Tools.getInstance();

interface ToastState extends ToastProps {
    show?: boolean;
}
class Toast extends React.PureComponent<any, ToastState> {
    readonly state: ToastState = {};
    closeTimer: any;
    constructor(props: any) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }
    render() {
        let { state } = this,
            { duration, overlay, children, className, style, show = true, type } = state,
            iconEl;

        window.clearTimeout(this.closeTimer);

        if (show) {
            if (duration === 0)
                duration = 100000;
            this.closeTimer = window.setTimeout(this.handleClose, duration);

            iconEl = type ? <Icon icon={presetIconMap[type]} /> : '';
        }

        return (
            <React.Fragment>
                <div className={tools.classNames(toastCSS.toast, className)} style={style}>
                    <div className={tools.classNames(toastCSS.icon)}>{iconEl}</div>
                    <div className={tools.classNames(toastCSS.content)}>{ children }</div>
                </div>
                { overlay ? <div className={tools.classNames(toastCSS.overlay)}></div> : '' }
            </React.Fragment>
        )
    }
    handleClose() {
        let { onClose } = this.state;

        this.setState({ show: false});
        onClose && onClose();
    }
}
// TODO 优化图标效果及自定义图标逻辑, 单例模式
// tslint:disable-next-line:max-classes-per-file
export default class Factory extends React.PureComponent<ToastProps, any> {
    static defaultProps: Partial<ToastProps> = {
        duration: 7000, // 默认7000毫秒
        overlay: false,
    };
    static hide = () => {
        Factory.toastRef.current.setState({ show: false });
    }
    static toastTag: React.ComponentElement<Toast, any>;
    static toastRef: React.RefObject<any> = React.createRef();
    constructor(props: ToastProps) {
        super(props);
    }
    render() {
        if (!Factory.toastTag) {
            Factory.toastTag = <Toast ref={Factory.toastRef}></Toast> as React.ComponentElement<Toast, any>;
        }

        return Factory.toastTag;
    }
    componentDidMount() {
        Factory.toastRef.current.setState({...this.props});
    }
    componentDidUpdate() {
        Factory.toastRef.current.setState({...this.props});
    }
}