import * as React from 'react';
import Tools from '../utils/Tools';
import Log from '../utils/Log';

const tools = Tools.getInstance();
export interface TouchProps {
    disabled?: boolean;
    activeClassName?: string;
    activeStyle?: object;
    children?: JSX.Element;
}
export interface TouchState {
    active: boolean;
}
export default class TouchFeedback extends React.PureComponent<TouchProps, TouchState> {
    static defaultProps: TouchProps = {
        disabled: false,
    };
    readonly state: TouchState = {
        active: false,
    }
    constructor(props: TouchProps) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    private onTouchStart(e) {
        this.triggerEvent('TouchStart', true, e)
    }
    private onTouchEnd(e) {
        this.triggerEvent('TouchEnd', false, e);
    }
    private onTouchCancel(e) {
        this.triggerEvent('TouchCancel', false, e);
    }
    private onMouseDown(e) {
        // pc simulate mobile
        this.triggerEvent('MouseDown', true, e);
    }
    private onMouseUp(e) {
        this.triggerEvent('MouseUp', false, e);
    }
    private triggerEvent(type: string, isActive: boolean, e) {
        let eventType = 'on' + type,
            { children } = this.props,
            { active } = this.state;

        if (children && children.props[eventType]) {
            children.props[eventType](e);
        }
        if (isActive !== active) {
            this.setState({
                active: isActive
            });
        }
    }
    render() {
        let { props, state } = this,
            { activeClassName, activeStyle, children, disabled } = props,
            { active } = state,
            events = disabled ? undefined : {
                onTouchStart: this.onTouchStart,
                onTouchEnd: this.onTouchEnd,
                onTouchCancel: this.onTouchCancel,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
            },
            nextProps;

        if (React.Children.count(children) === 1 && React.isValidElement<any>(children)) {
            let child = children;
            if (!disabled && active) {
                let { style, className } = child.props;
    
                if (activeStyle) {
                    style = { ...style, ...activeStyle };
                }
                className = tools.classNames(className, activeClassName);
    
                nextProps = { className, style, ...events };
            } else {
                nextProps = events;
            }
            return React.cloneElement(child, nextProps);
        } else {
            Log.error('[TouchFeedback]children属性只能是一个元素，但当前不是。','children:', children, 'children count:', React.Children.count(children));
            return children;
        }
    }
    componentDidUpdate() {
        if (this.props.disabled && this.state.active) {
            this.setState({
                active: false
            });
        }
    }
}