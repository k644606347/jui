import { CSSAttrs, Omit } from "../utils/types";
import * as React from "react";
import toastCSS from './Toast.scss';
import Tools from "src/utils/Tools";
import { iconSpinner, iconCheckCircle_r, iconTimesCircle_r, iconExclamationCircle, iconInfoCircle } from "./icons/FontAwesomeMap";
import Icon, { IconProps } from "./Icon";

const presetIconMap = {
    info: iconInfoCircle,
    loading: iconSpinner,
    success: iconCheckCircle_r,
    error: iconTimesCircle_r,
    warn: iconExclamationCircle
}
const tools = Tools.getInstance();

interface ToastState extends CSSAttrs {
    duration?: number;
    onClose?: () => void;
    overlay?: boolean;
    type?: 'info' | 'loading' | 'success' | 'error' | 'warn';
    icon?: React.ReactElement<IconProps>;
    content?: React.ReactNode;
    show?: boolean;
}

const defaultState: ToastState = {
    content: '',
    duration: 3000,
    overlay: false,
    show: true,
}

export class StatefulToast extends React.PureComponent<any, ToastState> {
    readonly state: ToastState = defaultState;
    private closeTimer: any;
    private wrapperRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.wrapperRef = React.createRef();
    }
    render() {
        let { state } = this,
            { duration, overlay, content, className, style, show, type } = state;

        window.clearTimeout(this.closeTimer);
        if (show) {
            if (duration === 0)
                duration = 10000000;
            this.closeTimer = window.setTimeout(this.handleClose, duration);
        }

        return (
            <React.Fragment>
                <div ref={this.wrapperRef} className={tools.classNames(toastCSS.toast, className)} style={style}>
                    <div className={tools.classNames(toastCSS.icon)}>
                        {
                            type ? <Icon icon={presetIconMap[type]} spin={type === 'loading'}/> : ''
                        }
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
    private displayTimer: any;
    toggleDisplay() {
        let wrapperEl = this.wrapperRef.current,
            wrapperStyle = wrapperEl.style,
            { show } = this.state;

        if (show) {
            window.clearTimeout(this.displayTimer);
            wrapperStyle.display = 'block';
            wrapperEl.classList.add(toastCSS.show);
        } else {
            wrapperEl.classList.remove(toastCSS.show);

            if (wrapperStyle.display !== 'none')
                this.displayTimer = window.setTimeout(() => {
                    wrapperStyle.display = 'none';
                }, 1000);
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
    ) => void;

interface Factory {
    isShow: () => boolean;
    info: ToastHandler,
    success: ToastHandler,
    error: ToastHandler,
    warn: ToastHandler,
    loading: ToastHandler,
    show: (args?: Partial<ToastState>) => void;
    hide: () => void;
    toastObj?: React.Component<any, ToastState>;
}

const Factory: Factory = {
    toastObj: undefined,
    isShow() {
        return Boolean(this.toastObj && this.toastObj.state.show);
    },
    show(args: Partial<ToastState>) {
        let nextState = {
                show: true,
            };

        if (tools.isPlainObject(args)) {
            nextState = Object.assign(nextState, defaultState);

            for (let k in args) {
                if (args[k] !== undefined) {
                    nextState[k] = args[k];
                }
            }
        }

        this.toastObj && this.toastObj.setState({...nextState, show: true});
    },
    hide() {
        this.toastObj && this.toastObj.setState({ show: false });
    },
    info(content, duration, options = {}) {
        this.show.call(this, {
            ...options,
            content,
            duration,
            type: 'info',
        });
    },
    success(content, duration, options = {}) {
        this.show.call(this, {
            ...options,
            content,
            duration,
            type: 'success',
        });
    },
    error(content, duration, options = {}) {
        this.show.call(this, {
            ...options,
            content,
            duration,
            type: 'error',
        });
    },
    warn(content, duration, options = {}) {
        this.show.call(this, {
            ...options,
            content,
            duration,
            type: 'warn',
        });
    },
    loading(content, duration, options = {}) {
        this.show.call(this, {
            ...options,
            content,
            duration,
            type: 'loading',
        });
    }
}
export default Factory;