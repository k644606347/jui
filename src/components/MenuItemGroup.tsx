import * as React from "react";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import { IMenuItemGroupProps, IMenuItemGroupState } from "./MenuItemGroupType";
import { MouseEvent } from "react";

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
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        let { label, active, className, style, icon } = this.props,
            { clicked } = this.state;

        return <div className={tools.classNames(cssModules.item, cssModules['item-group'], active && cssModules['item-group-active'], clicked ? cssModules['item-clicked'] : '', className)} style={style} onClick={this.handleClick}>
            <div className={cssModules['item-icon']}>{Icon.renderIcon(icon)}</div>
            <div className={cssModules['item-content']}>{label}</div>
            <div className={cssModules['item-group-arrow']}><Icon icon={iconChevronRight_solid} /></div>
        </div>;
    }
    private handleClick(e: MouseEvent<HTMLElement>) {
        let { id, onChange } = this.props;

        this.setState({clicked: true});
        clearTimeout(this.clickedTimer);
        this.clickedTimer = window.setTimeout(() => this.setState({clicked: false}), 100);

        onChange && onChange({ id });
    }
}