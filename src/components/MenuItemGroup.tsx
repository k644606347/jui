import * as React from "react";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import { IMenuItemGroupProps, IMenuItemGroupState } from "./MenuItemGroupType";
import MenuItems from "./MenuItems";
import { iconChevronRight } from "./icons/FontAwesomeMap";

const tools = Tools.getInstance();

export default class MenuItemGroup extends React.PureComponent<IMenuItemGroupProps, IMenuItemGroupState> {
    private static defaultProps: IMenuItemGroupProps = {
        id: '',
        label: '',
        active: false,
    };
    private clickedTimer: number;
    constructor(props: IMenuItemGroupProps) {
        super(props);

        this.state = {
            clicked: false,
        };
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
                    clicked && cssModules['item-clicked'],
                    className)
            } style={style} {...this.buildEvents()}>
                <div className={cssModules['item-icon']}>{icon && Icon.renderIcon(icon)}</div>
                <div className={cssModules['item-content']}>{label}</div>
                <div className={cssModules['sub-item-arrow']}>
                    <Icon icon={iconChevronRight} />
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
        // todo 增加MenuItems的操作反馈
        this.setState({ clicked: true });
    }
    private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
        this.setState({ clicked: false });
        this.fireChangeCallback();
    }
    private handleClick(e: React.MouseEvent<HTMLElement>) {
        this.setState({ clicked: true });
        clearTimeout(this.clickedTimer);
        this.clickedTimer = window.setTimeout(() => this.setState({ clicked: false }), 150);

        this.fireChangeCallback();
    }
    private fireChangeCallback(options?: any) {
        let { id, onChange } = this.props;

        onChange && onChange({ id });
    }
}