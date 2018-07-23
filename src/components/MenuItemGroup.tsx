import * as React from "react";
import { IMenuItemProps } from "./MenuItemType";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import { IMenuItemGroupProps } from "./MenuItemGroupType";

const tools = Tools.getInstance();

export default class MenuItemGroup extends React.PureComponent<IMenuItemGroupProps> {
    private static defaultProps: IMenuItemGroupProps = {
        name: tools.genID(),
        label: MenuItemGroup.defaultProps.name,
        items: [],
        value: [],
    };
    constructor(props: IMenuItemGroupProps) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { className, style, name, label, items, value, active, icon, children } = this.props;

        return <div className={tools.classNames(cssModules['menu-item-group'], active && cssModules['active-item'], className)} style={style}>
            {children}
        </div>;
    }
    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { name, onChange } = this.props,
            checked = e.target.checked;

        onChange && onChange({ name, checked: checked});
    }
}