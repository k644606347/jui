import * as React from "react";
import { IMenuItemsProps, ItemGroupData, ItemData } from "./Menu";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";

const tools = Tools.getInstance();
export default class MenuItems extends React.PureComponent<IMenuItemsProps, any> {
    constructor(props: IMenuItemsProps) {
        super(props);
    }
    public render() {
        let { props } = this,
            { items } = props;

        return <div ref='items' className={cssModules['menu-items']}>
        {
            items.map((item, i) => {
                return <div key={i} className={cssModules['menu-item']}>{
                    tools.isArray((item as ItemGroupData).items) ? this.renderItemGroup(item as ItemGroupData) : this.renderItem(item as ItemData)
                }</div>;
            })
        }
    </div>;
    }
    public renderItemGroup(itemGroup: ItemGroupData): JSX.Element {
        let { className, style, render, label } = itemGroup;

        return <div className={tools.classNames(cssModules['menu-item-group'], className)} style={style}>{
            render ? render(itemGroup) : <React.Fragment>{label}<Icon icon={iconChevronRight_solid} /></React.Fragment>
        }</div>;
    }

    // todo add onChange logic
    public renderItem(item: ItemData): JSX.Element {
        let { className, style, render, label } = item;

        return <div className={tools.classNames(cssModules['menu-item'], className)} style={style}>{
            render ? render(item) : <React.Fragment>{label}</React.Fragment>
        }</div>
    }

    // todo improve onChange params
    public handleChange(e: Event) {
        let { onChange } = this.props;

        onChange && onChange(e);
    }
}