import * as React from 'react';
import Tools from '../utils/Tools';

const tools = Tools.getInstance();
export interface TouchProps {
    disabled?: boolean;
    activeClassName?: string;
    activeStyle?: object;
    children?: any;
}
export interface TouchState {
    active: boolean;
}
export default class TouchFeedback extends React.PureComponent<TouchProps, TouchState> {
    public static defaultProps: TouchProps = {
        disabled: false,
    };
    public readonly state: TouchState = {
        active: false,
    }
    constructor(props: TouchProps) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }
    public onTouchStart(e: any) {
        this.triggerEvent('TouchStart', true, e)
    }
    public onTouchMove(e: any) {
        this.triggerEvent('TouchMove', false, e);
    }
    public onTouchEnd(e: any) {
        this.triggerEvent('TouchEnd', false, e);
    }
    public onTouchCancel(e: any) {
        this.triggerEvent('TouchCancel', false, e);
    }
    public onMouseDown(e: any) {
        // pc simulate mobile
        this.triggerEvent('MouseDown', true, e);
    }
    public onMouseUp(e: any) {
        this.triggerEvent('MouseUp', false, e);
    }
    public onMouseLeave(e: any) {
        this.triggerEvent('MouseLeave', false, e);
    }
    public triggerEvent(type: string, isActive: boolean, e: any) {
        let eventType = 'on' + type,
            { children } = this.props,
            { active } = this.state;

        if (children.props[eventType]) {
            children.props[eventType](e);
        }
        if (isActive !== active) {
            this.setState({
                active: isActive
            });
        }
    }
    public componentDidUpdate() {
        if (this.props.disabled && this.state.active) {
            this.setState({
                active: false
            });
        }
    }
    public render() {
        let { props, state } = this,
            { activeClassName, activeStyle, children, disabled } = props,
            { active } = state,
            events = disabled ? undefined : {
                onTouchStart: this.onTouchStart,
                // tslint:disable-next-line:object-literal-sort-keys
                onTouchMove: this.onTouchMove,
                onTouchEnd: this.onTouchEnd,
                onTouchCancel: this.onTouchCancel,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onMouseLeave: this.onMouseLeave
            },
            extraProps = events,
            child = React.Children.only(children);

        if (!disabled && active) {
            let childProps = child.props,
                style = childProps.style,
                className = childProps.className;

            if (activeStyle) {
                style = Object.assign({}, style, activeStyle);
            }
            className = tools.classNames(className, activeClassName);

            extraProps = Object.assign({ className, style }, events);
        }
        return React.cloneElement(child, extraProps);
    }
}