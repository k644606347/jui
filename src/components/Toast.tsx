import View from "./View";
import { CSSAttrs, Omit } from "../utils/types";
import Icon, { IconProps } from "./Icon";
import * as React from "react";
import { tools } from "../utils/Tools";
import { iconInfoCircleOutline, iconLoading, iconCheckCircleOutline, iconCloseCircleOutline, iconAlert } from "./icons/SVGData";
import toastCSS from './Toast.scss';
import * as ReactDOM from "react-dom";

export interface ToastProps extends CSSAttrs {
    duration?: number;
    overlay?: boolean;
    type?: 'info' | 'loading' | 'success' | 'error' | 'warn';
    content?: React.ReactNode;
    animate?: boolean;
    icon?: React.ReactElement<IconProps> | boolean;
    showOnInit?: boolean;
    onClose?: () => void;
    onCloseAnimationEnd?: () => void;
    position?: 'top' | 'middle' | 'bottom';
    theme?: 'light' | 'dark';
}
export interface ToastState {
    show: boolean;
}
const presetIconMap = {
    info: iconInfoCircleOutline,
    loading: iconLoading,
    success: iconCheckCircleOutline,
    error: iconCloseCircleOutline,
    warn: iconAlert
}
class ToastComponent extends View<ToastProps, ToastState> {
    static defaultProps: ToastProps = {
        duration: 3000,
        overlay: false,
        content: '',
        showOnInit: true,
        animate: true,
        icon: false,
        position: 'middle',
        theme: 'dark',
    }
    private handleCloseTimer;
    private wrapperRef = React.createRef<any>();
    private toastRef = React.createRef<any>();
    constructor(props: ToastProps) {
        super(props);
        
        this.state = {
            show: !!props.showOnInit,
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    }
    render() {
        let { props } = this,
            { overlay, content, className, style, type, icon, position, theme } = props,
            iconEl;

        if (Icon.isIconElement(icon)) {
            iconEl = icon;
        } else {
            iconEl = type ? <Icon icon={presetIconMap[type]} spin={type === 'loading'}/> : '';
        }
        return (
            <div ref={this.wrapperRef} className={
                tools.classNames(toastCSS.wrapper, theme && toastCSS[theme], overlay && toastCSS.overlay)
                }>
                <div ref={this.toastRef} className={
                    tools.classNames(toastCSS.toast, position && toastCSS[position], className)
                    } style={style}>
                    {
                        iconEl ? 
                            <div className={tools.classNames(toastCSS.icon)}>
                                { iconEl }
                            </div>
                            : ''
                    }
                    {
                        content ? 
                            <div className={tools.classNames(toastCSS.content)}>{ content }</div>
                            : ''
                    }
                </div>
            </div>
        );
    }
    handleClose() {
        let { onClose } = this.props;

        onClose && onClose();
    }
    componentDidMount() {
        let { duration } = this.props,
            { show } = this.state,
            toastEl = this.toastRef.current;

        toastEl.addEventListener("transitionend", this.handleTransitionEnd, false);
        if (show && (duration && duration > 0)) {
            this.handleCloseTimer = window.setTimeout(() => { this.setState({ show: false }) }, duration);
        }
        this.toggleDisplay();
    }
    componentDidUpdate(prevProps: ToastProps, prevState: ToastState) {
        let { duration } = this.props,
            { show } = this.state;

        if (show !== prevState.show || duration !== prevProps.duration) {
            window.clearTimeout(this.handleCloseTimer);
            if (show && (duration && duration > 0)) {
                this.handleCloseTimer = window.setTimeout(() => { this.setState({ show: false }) }, duration);
            }
        }
        if (show !== prevState.show)
            this.toggleDisplay();
    }
    toggleDisplay() {
        let wrapperEl = this.wrapperRef.current,
            toastEl = this.toastRef.current,
            { animate } = this.props,
            { show } = this.state,
            wrapperClassList = wrapperEl.classList,
            toastClassList = toastEl.classList;

        if (show) {
            wrapperClassList.add(toastCSS.wrapperShow);
            if (animate) {
                window.setTimeout(() => {
                    toastClassList.add(toastCSS.show);
                    this.toggleAnimateClass();
                }, 50);
            } else {
                toastClassList.add(toastCSS.show);
                this.toggleAnimateClass();
            }
        } else {
            toastClassList.remove(toastCSS.show);
            if (!animate) {
                wrapperClassList.remove(toastCSS.wrapperShow);
            }
            this.toggleAnimateClass();
            this.handleClose();
        }
    }
    toggleAnimateClass() {
        let { animate, overlay } = this.props,
            wrapperEl = this.wrapperRef.current,
            toastEl = this.toastRef.current,
            wrapperClassList = wrapperEl.classList,
            toastClassList = toastEl.classList;
            
        if (animate) {
            toastClassList.add(toastCSS.animate);
            overlay && wrapperClassList.add(toastCSS.overlayAnimate);
        } else {
            toastClassList.remove(toastCSS.animate);
            overlay && wrapperClassList.remove(toastCSS.overlayAnimate);
        }
    }
    handleTransitionEnd(e) {
        if (e.target.classList.contains(toastCSS.show)) {
            return;
        }

        let wrapperEl = this.wrapperRef.current,
            wrapperClassList = wrapperEl.classList,
            { onCloseAnimationEnd } = this.props;

        wrapperClassList.remove(toastCSS.wrapperShow);
        onCloseAnimationEnd && onCloseAnimationEnd();
    }
}

type State = Omit<ToastProps, 'showOnInit'> & ToastState;
class StatefulToast extends React.PureComponent<any, State> {
    toastRef = React.createRef<ToastComponent>();
    Component = ToastComponent;
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }
    render() {
        let { show, ...restState } = this.state;
        return <ToastComponent ref={this.toastRef} {...restState} showOnInit={show}/>
    }
    componentDidUpdate(prevProps, prevState: State) {
        let { show } = this.state;
        if (show !== prevState.show) {
            this.toastRef.current && this.toastRef.current.setState({ show });
        }
    }
    isShow() {
        return Boolean(this.state.show);
    }
    show(args?: Partial<State>) {
        let { onClose } = this.state,
            nextState = { ...ToastComponent.defaultProps, ...args, show: true, onClose };

        if (this.isShow()) {
            this.hide({ animate: false, onClose: undefined });
            window.setTimeout(() => {
                this.setState(nextState);
            }, 0);
        } else {
            this.setState(nextState);
        }
        return this;
    }
    hide(args?: Partial<State>) {
        this.setState({ ...args, show: false });
        return this;
    }
    info(content: State['content'], duration?: State['duration'], options?) {
        return this.show({
            ...ToastComponent.defaultProps,
            ...options,
            content,
            duration,
            type: 'info',
        });
    }
    success(content: State['content'], duration?: State['duration'], options?) {
        return this.show({
            ...options,
            content,
            duration,
            type: 'success',
        });
    }
    error(content: State['content'], duration?: State['duration'], options?) {
        return this.show({
            ...ToastComponent.defaultProps,
            ...options,
            content,
            duration,
            type: 'error',
        });
    }
    warn(content: State['content'], duration?: State['duration'], options?) {
        return this.show({
            ...ToastComponent.defaultProps,
            ...options,
            content,
            duration,
            type: 'warn',
        });
    }
    loading(content: State['content'], duration?: State['duration'], options?) {
        return this.show({
            ...ToastComponent.defaultProps,
            ...options,
            content,
            duration,
            type: 'loading',
        });
    }
    content(content?: State['content']) {
        if (content !== undefined && content !== null) {
            this.setState({ content });
            return;
        } else {
            return this.state.content;
        }
    }
    icon(icon?: State['icon']) {
        if (icon !== undefined && icon !== null) {
            this.setState({ icon });
            return;
        } else {
            return this.state.icon;
        }
    }
}

let wrapper = document.createElement('div'),
    rootEl = document.body ? document.body : document.documentElement;
rootEl.appendChild(wrapper);

let Toast = ReactDOM.render(<StatefulToast></StatefulToast>, wrapper) as React.Component<any, State> & StatefulToast;
export default Toast;