import * as React from "react";
import { IMenuItemsProps } from "./MenuItemsType";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import MenuItem from "./MenuItem";
import { IMenuItemChangeEvent } from "./MenuItemType";

const tools = Tools.getInstance();
// todo checked mutiple
export default class MenuItems extends React.PureComponent<IMenuItemsProps, any> {
    private static defaultProps: IMenuItemsProps = {
        name: tools.genID(),
        label: '',
        items: [],
        multiple: false,
        level: 1,
        activeIndex: 0,
    };
    constructor(props: IMenuItemsProps) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
    }
    public render() {
        let { props } = this,
            { items, level, activeIndex } = props;

        if (activeIndex === undefined) {
            activeIndex = MenuItems.defaultProps.activeIndex;
        } else if (activeIndex >= items.length) {
            activeIndex = items.length - 1;
        }
        
        let activeItem = items[activeIndex as number],
            activeItemGroup = (activeItem && tools.isArray((activeItem as IMenuItemsProps).items)) ? (activeItem as IMenuItemsProps) : undefined;

        return <React.Fragment>
            <div className={cssModules['menu-items-level-wrap']}>{
                items.map((item, i) => {
                    let active = activeIndex === i;

                    return <React.Fragment key={i}>{
                        tools.isArray((item as IMenuItemsProps).items) ? this.renderItemGroup(item as IMenuItemsProps, active) : 
                            <MenuItem {...item} onChange={this.handleChange} />
                    }</React.Fragment>;
                })
            }</div>
            {
                level === 2 ? <div className={cssModules['menu-items-level-wrap']}>{
                    activeItemGroup && this.renderActiveItemGroupItems(activeItemGroup)
                }</div> : null
            }
            </React.Fragment>
    }
    public renderActiveItemGroupItems(activeItemGroup: IMenuItemsProps): JSX.Element {
        let { items, multiple, activeIndex } = activeItemGroup;

        return <MenuItems name={activeItemGroup.name} label={activeItemGroup.label} items={items} multiple={multiple} activeIndex={activeIndex} onChange={this.handleGroupChange}/>;
    }
    public renderItemGroup(itemGroup: IMenuItemsProps, actived: boolean = false): JSX.Element {
        let { className, style, label, icon, multiple } = itemGroup;

        if (multiple === undefined) {
            multiple = this.props.multiple;
        }

        return <div className={tools.classNames(cssModules['menu-item-group'], actived && cssModules['active-item'], className)} style={style}>
            {Icon.renderIcon(icon)}{label}<Icon icon={iconChevronRight_solid} />
        </div>;
    }

    public handleGroupChange(e: any) {
        let { name, onChange } = this.props;

        onChange && onChange({name, value: [e]});
    }
    public handleChange(e: IMenuItemChangeEvent) {
        let { name, onChange } = this.props;

        onChange && onChange({name, value: [e]});
    }
}