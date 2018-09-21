import * as React from "react";
import { MenuItemProps, MenuItemState } from "./MenuItemType";
import cssModules from './MenuItem.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import Checkbox from "./Checkbox";
import Radio from "./Radio";

const tools = Tools.getInstance();

export default class MenuItem extends React.PureComponent<MenuItemProps, MenuItemState> {
    private static defaultProps: MenuItemProps = {
        value: 'item',
        label: 'item',
        name: 'item',
        checked: false,
        multiSelect: false,
    };
    private clickedTimer: number;
    public readonly state: MenuItemState = {
        clicked: false,
    }
    constructor(props: MenuItemProps) {
        super(props);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        let { label, checked, className, style, icon } = this.props,
            { clicked } = this.state;

        return (
            <div className={
                tools.classNames(
                    cssModules.item,
                    checked && cssModules.checked,
                    clicked && cssModules.clicked,
                    className
                )
            } style={style} {...this.buildEvents()}>
                {
                    icon && <div className={cssModules.icon}>{Icon.renderIcon(icon)}</div>
                }
                <div className={cssModules.content}>{label}</div>
                {
                    this.renderInputComponent()
                }
            </div>
        )
    }
    private buildEvents() {
        if (tools.supportTouchEvents()) {
            return {
                onTouchStart: this.handleTouchStart,
                onTouchEnd: this.handleTouchEnd,
            };
        } else {
            // 兼容pc端
            return {
                onClick: this.handleClick,
            }
        }
    }
    private renderInputComponent() {
        let { multiSelect, name, value, checked } = this.props,
            propsConfig = {
                name,
                value,
                checked,
                className: tools.classNames(cssModules.input)
            };

        return multiSelect ? <Checkbox {...propsConfig} /> : checked ? <Radio {...propsConfig} /> : '';
    }
    private handleTouchStart(e: React.TouchEvent<HTMLElement>) {
        this.setState({ clicked: true });
    }
    private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
        this.setState({ clicked: false });
        this.fireChange({ checked: !this.props.checked });
    }
    private handleClick(e: React.MouseEvent<HTMLElement>) {
        this.setState({ clicked: true });
        clearTimeout(this.clickedTimer);
        this.clickedTimer = window.setTimeout(() => this.setState({ clicked: false }), 150);

        this.fireChange({ checked: !this.props.checked });
    }
    private fireChange(options: any) {
        let { value, onChange } = this.props,
            { checked } = options;

        onChange && onChange({ value, checked });
    }
}