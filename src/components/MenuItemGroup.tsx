import * as React from "react";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import { IMenuItemGroupProps } from "./MenuItemGroupType";
import { MouseEvent } from "react";

const tools = Tools.getInstance();

export default class MenuItemGroup extends React.PureComponent<IMenuItemGroupProps> {
    private static defaultProps: IMenuItemGroupProps = {
        id: '',
        label: '',
        active: false,
    };
    constructor(props: IMenuItemGroupProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    public render() {
        let { label, active, className, style, icon } = this.props;

        return <div className={tools.classNames(cssModules['item-group'], active && cssModules['active-item-group'], className)} style={style} onClick={this.handleClick}>
            {Icon.renderIcon(icon)}{label}<Icon icon={iconChevronRight_solid} />
        </div>;
    }
    private handleClick(e: MouseEvent<HTMLElement>) {
        let { id, onChange } = this.props;

        onChange && onChange({ id });
    }
}