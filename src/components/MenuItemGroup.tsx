import * as React from "react";
import Tools from "../utils/Tools";
import Icon from "./Icon";
import { MenuItemGroupProps, MenuItemGroupState } from "./MenuItemGroupType";
import cssModules from './MenuItem.scss';
import { iconArrowForward } from "./icons/SVGData";

const tools = Tools.getInstance();

export default class MenuItemGroup extends React.PureComponent<MenuItemGroupProps, MenuItemGroupState> {
    private static defaultProps: Partial<MenuItemGroupProps> = {
        id: '',
        label: '',
        active: false,
    };
    private clickedTimer: number;
    public readonly state: MenuItemGroupState = {
        clicked: false,
    }
    constructor(props: MenuItemGroupProps) {
        super(props);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        let { label, active, className, style, icon } = this.props,
            { clicked } = this.state;

        return (
            <div className={
                tools.classNames(
                    cssModules.item, cssModules['item-group'],
                    active && cssModules['item-group-active'],
                    clicked && cssModules.clicked,
                    className)
            } style={style} {...this.buildEvents()}>
                {
                    icon && <div className={cssModules.icon}>{Icon.renderIcon(icon)}</div>
                }
                <div className={cssModules.content}>{label}</div>
                <div className={cssModules['sub-item-arrow']}>
                    <Icon icon={iconArrowForward} />
                </div>
            </div>
        );
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
    private handleTouchStart(e: React.TouchEvent<HTMLElement>) {
        // TODO 增加MenuItems的操作反馈
        this.setState({ clicked: true });
    }
    private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
        this.setState({ clicked: false });
        this.fireClick();
    }
    private handleClick(e: React.MouseEvent<HTMLElement>) {
        this.setState({ clicked: true });
        clearTimeout(this.clickedTimer);
        this.clickedTimer = window.setTimeout(() => this.setState({ clicked: false }), 150);

        this.fireClick();
    }
    private fireClick() {
        let { id, targetItems, onClick } = this.props;

        onClick && onClick({ id, targetItems });
    }
}