import { CSSAttrs, Omit, AnyFunction } from "../utils/types";
import * as React from "react";
import Icon, { IconProps } from "./Icon";
import toastCSS from './Toast.scss';
import Tools from "../utils/Tools";
import { iconCloseCircleOutline, iconAlert, iconLoading, iconInfoCircleOutline, iconCheckCircleOutline } from "./icons/SVGData";

const presetIconMap = {
    info: iconInfoCircleOutline,
    loading: iconLoading,
    success: iconCheckCircleOutline,
    error: iconCloseCircleOutline,
    warn: iconAlert
}
const tools = Tools.getInstance();

interface ToastState extends CSSAttrs {
    duration?: number;
    onClose?: () => void;
    overlay?: boolean;
    type?: 'info' | 'loading' | 'success' | 'error' | 'warn' | '';
    icon?: React.ReactElement<IconProps> | boolean;
    content?: React.ReactNode;
    show?: boolean;
    transition?: boolean;
}

const defaultState: ToastState = {
    content: '',
    duration: 3000,
    overlay: false,
    show: true,
    type: '',
    icon: true,
    transition: true,
}

export class StatefulToast extends React.PureComponent<any, ToastState> {
    private toggleAnimationDuration = 1000;
    private toggleAnimationTimer: any;
    private handleCloseTimer: any;
    private wrapperRef: React.RefObject<any>;
    readonly state: ToastState = {
        ...defaultState,
        show: false,
    };
    constructor(props: any) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.wrapperRef = React.createRef();
    }
    render() {
        let { state } = this,
            { duration, overlay, content, className, style, show, type, icon } = state;

        window.clearTimeout(this.handleCloseTimer);
        if (show) {
            if (duration === 0)
                duration = 10000000;
            this.handleCloseTimer = window.setTimeout(this.handleClose, duration);
        }

        let iconEl;

        if (icon) {
            if (Icon.isIconElement(icon)) {
                iconEl = icon;
            } else {
                iconEl = type ? <Icon icon={presetIconMap[type]} spin={type === 'loading'}/> : '';
            }
        }
        return (
            <React.Fragment>
                <div ref={this.wrapperRef} className={tools.classNames(toastCSS.toast, className)} style={style}>
                    <div className={tools.classNames(toastCSS.icon)}>
                        { iconEl }
                    </div>
                    <div className={tools.classNames(toastCSS.content)}>{ content }</div>
                </div>
                { overlay ? <div className={tools.classNames(toastCSS.overlay)}></div> : '' }
            </React.Fragment>
        )
    }
    componentDidMount() {
        Toast._toast = this;

        this.toggleDisplay();
    }
    componentDidUpdate() {
        this.toggleDisplay();
    }
    toggleDisplay() {
        let wrapperEl = this.wrapperRef.current,
            wrapperStyle = wrapperEl.style,
            { show, transition } = this.state,
            { classList } = wrapperEl;

        if (show) {
            window.clearTimeout(this.toggleAnimationTimer);
            wrapperStyle.display = 'block';
            window.setTimeout(() => {
                if (transition)
                    classList.add(toastCSS.transition);
                else 
                    classList.remove(toastCSS.transition);
                classList.add(toastCSS.show);
            }, 0);
        } else {
            classList.remove(toastCSS.show);

            if (wrapperStyle.display !== 'none')
                this.toggleAnimationTimer = window.setTimeout(() => {
                    wrapperStyle.display = 'none';
                }, this.toggleAnimationDuration);
        }
    }
    handleClose() {
        let { onClose } = this.state;

        this.setState({ show: false});
        onClose && onClose();
    }
}

type ToastHandler = (
    content: ToastState['content'], duration?: ToastState['duration'], 
    options?: Omit<Partial<ToastState>, 'content' | 'duration'>
    ) => Factory;

interface Factory {
    _toast?: React.Component<any, ToastState>;
    isShow: () => boolean;
    show: (args?: Partial<ToastState>) => Factory;
    hide: () => Factory;
    info: ToastHandler,
    success: ToastHandler,
    error: ToastHandler,
    warn: ToastHandler,
    loading: ToastHandler,
    content: AnyFunction;
    icon: AnyFunction;
}

const Toast: Factory = {
    _toast: undefined,
    isShow() {
        return Boolean(this._toast && this._toast.state.show);
    },
    show(args?: Partial<ToastState>) {
        let nextState = { ...defaultState, ...args, show: true };

        if (this.isShow()) {
            this.hide({ transition: false });
            window.setTimeout(() => {
                this._toast && this._toast.setState(nextState);
            }, 100);
        } else {
            this._toast && this._toast.setState(nextState);
        }
        return this;
    },
    hide(args?: Partial<ToastState>) {
        let nextState = { ...defaultState, ...args, show: false };

        this._toast && this._toast.setState(nextState);
        return this;
    },
    info(content, duration, options = {}) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'info',
        });
    },
    success(content, duration, options = {}) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'success',
        });
    },
    error(content, duration, options = {}) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'error',
        });
    },
    warn(content, duration, options = {}) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'warn',
        });
    },
    loading(content, duration, options = {}) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'loading',
        });
    },
    content(content?: React.ReactNode): any {
        if (content !== undefined && content !== null) {
            this._toast && this._toast.setState({ content });
        } else {
            return this._toast && this._toast.state.content;
        }
    },
    icon(icon?: ToastState['icon']): any {
        if (icon !== undefined && icon !== null) {
            this._toast && this._toast.setState({ icon });
        } else {
            return this._toast && this._toast.state.icon;
        }
    }
}
export default Toast;