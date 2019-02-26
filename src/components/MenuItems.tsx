import * as React from "react";
import { MenuItemsProps, MenuItemsChangeEvent } from "./MenuItemsType";
import menuItemsCSS from './MenuItems.scss';
import Tools, { tools } from "../utils/Tools";
import MenuItem from "./MenuItem";
import { MenuItemProps, MenuItemChangeEvent } from "./MenuItemType";
import MenuItemGroup from "./MenuItemGroup";
import { ClickEvent } from "./MenuItemGroupType";
import View from "./View";

export default class MenuItems extends View<MenuItemsProps> {
    private static defaultProps: MenuItemsProps = {
        id: 'items',
        label: 'items',
        checked: [],
        items: [],
        multiSelect: false,
        level: 1,
        activeIndex: 0,
    };
    cssObject = menuItemsCSS;
    constructor(props: MenuItemsProps) {
        super(props);
        
        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleSubItemsChange = this.handleSubItemsChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
    }
    render() {
        let { props } = this,
            { id, items, level, activeIndex, multiSelect, className, style } = props;

        let activeItem = items[activeIndex!],
            activeSubItems = (activeItem && tools.isArray((activeItem as MenuItemsProps).items)) ? (activeItem as MenuItemsProps) : undefined,
            inputTagName = `${id}_${tools.genID()}`,
            cssModules = this.getCSSModules();

        // TODO 应为React.ReactElement<MenuItemsProps>
        let subItemsEl: any;
        if (level! > 1 && activeSubItems) {
            subItemsEl = this.renderActiveSubItems(activeSubItems);
        }
        return <React.Fragment>
            <div style={style} className={
                tools.classNames(
                    cssModules.items,
                    subItemsEl && cssModules['has-sub-items'],
                    className,
                )
            }>{
                items.map((item, i) => {
                    let active = activeIndex === i;

                    return <React.Fragment key={i}>{
                        tools.isArray((item as MenuItemsProps).items) ? 
                            <MenuItemGroup {...(item as MenuItemsProps)} targetItems={subItemsEl} active={active} onClick={this.handleGroupChange}/> : 
                            <MenuItem {...(item as MenuItemProps)} onChange={this.handleItemChange} multiSelect={multiSelect}/>
                    }</React.Fragment>;
                })
            }</div>
            {
                subItemsEl ? 
                    <div className={tools.classNames(cssModules.items, cssModules['active-sub-items'])}>{subItemsEl}</div> : ''
            }
            </React.Fragment>
    }
    private renderActiveSubItems(activeItemGroup: MenuItemsProps) {
        let { id, items, multiSelect, activeIndex } = activeItemGroup,
            { level } = this.props;

        if (multiSelect === undefined) {
            multiSelect = this.props.multiSelect;
        }

        return <MenuItems id={id} label={activeItemGroup.label} items={items} multiSelect={multiSelect} activeIndex={activeIndex} onChange={this.handleSubItemsChange}/>;
    }
    private handleGroupChange(e: ClickEvent) {
        let { id, items, multiSelect, onChange } = this.props;

        onChange && onChange({
            id, 
            items: [],
            multiSelect,
            activeIndex: items.findIndex(item => (item as MenuItemsProps).id === e.id)
        });
    }
    private handleSubItemsChange(e: MenuItemsChangeEvent) {
        let { id, items, multiSelect, onChange } = this.props;

        onChange && onChange({
            id, 
            items: [e], 
            multiSelect,
            activeIndex: items.findIndex(item => (item as MenuItemsProps).id === e.id)
        });
    }
    private handleItemChange(e: MenuItemChangeEvent) {
        let { id, items, multiSelect, onChange } = this.props;

        onChange && onChange({
            id, 
            items: [e],
            multiSelect,
        });
    }
}