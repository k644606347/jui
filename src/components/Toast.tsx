import { CSSAttrs, Omit, AnyFunction } from "../utils/types";
import * as React from "react";
import Icon, { IconProps } from "./Icon";
import toastCSS from './Toast.scss';
import Tools from "../utils/Tools";
import { iconInformationCircleOutline, iconCheckmarkCircleOutline, iconCloseCircleOutline, iconAlert, iconLoading } from "./icons/SVGData";

const presetIconMap = {
    info: iconInformationCircleOutline,
    loading: iconLoading,
    success: iconCheckmarkCircleOutline,
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
}

const defaultState: ToastState = {
    content: '',
    duration: 3000,
    overlay: false,
    show: true,
    type: '',
    icon: true,
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
        Factory.toastObj = this;

        this.toggleDisplay();
    }
    componentDidUpdate() {
        this.toggleDisplay();
    }
    toggleDisplay() {
        let wrapperEl = this.wrapperRef.current,
            wrapperStyle = wrapperEl.style,
            { show } = this.state;

        if (show) {
            window.clearTimeout(this.toggleAnimationTimer);
            wrapperStyle.display = 'block';
            wrapperEl.classList.add(toastCSS.show);
        } else {
            wrapperEl.classList.remove(toastCSS.show);

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
    toastObj?: React.Component<any, ToastState>;
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

const Factory: Factory = {
    toastObj: undefined,
    isShow() {
        return Boolean(this.toastObj && this.toastObj.state.show);
    },
    show(args: Partial<ToastState>) {
        let nextState = { ...defaultState };

        if (tools.isPlainObject(args)) {
            for (let k in args) {
                if (args[k] !== undefined) {
                    nextState[k] = args[k];
                }
            }
        }

        if (this.isShow()) {
            this.hide();
            window.setTimeout(() => {
                this.toastObj && this.toastObj.setState({...nextState, show: true});
            }, 100);
        } else {
            this.toastObj && this.toastObj.setState({...nextState, show: true});
        }
        return this;
    },
    hide() {
        this.toastObj && this.toastObj.setState({ ...defaultState, show: false });
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
            this.toastObj && this.toastObj.setState({ content });
        } else {
            return this.toastObj && this.toastObj.state.content;
        }
    },
    icon(icon?: ToastState['icon']): any {
        if (icon !== undefined && icon !== null) {
            this.toastObj && this.toastObj.setState({ icon });
        } else {
            return this.toastObj && this.toastObj.state.icon;
        }
    }
}
export default Factory;