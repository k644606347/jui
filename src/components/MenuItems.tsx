import * as React from "react";
import { IMenuItemsProps } from "./MenuItemsType";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import MenuItem from "./MenuItem";
import { IMenuItemChangeEvent, IMenuItemProps } from "./MenuItemType";
import MenuItemGroup from "./MenuItemGroup";
import { ChangeEvent } from "./MenuItemGroupType";

const tools = Tools.getInstance();
export default class MenuItems extends React.PureComponent<IMenuItemsProps, any> {
    private static defaultProps: IMenuItemsProps = {
        id: '',
        label: '',
        checked: [],
        items: [],
        multiSelect: false,
        level: 1,
        activeIndex: 0,
    };
    constructor(props: IMenuItemsProps) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubItemsChange = this.handleSubItemsChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
    }
    public render() {
        let { props } = this,
            { id, items, level, activeIndex, multiSelect } = props;

        if (activeIndex === undefined) {
            activeIndex = MenuItems.defaultProps.activeIndex;
        } else if (activeIndex >= items.length) {
            activeIndex = items.length - 1;
        }
        
        let activeItem = items[activeIndex as number],
            activeSubItems = (activeItem && tools.isArray((activeItem as IMenuItemsProps).items)) ? (activeItem as IMenuItemsProps) : undefined,
            inputTagName = `${id}_${tools.genID()}`;

            // todo 应为React.ReactElement<IMenuItemsProps>
        let subItemsREl: any = null;
        if (activeSubItems) {
            subItemsREl = this.renderActiveSubItems(activeSubItems);
        }
        return <React.Fragment>
            <div className={cssModules.items}>{
                items.map((item, i) => {
                    let active = activeIndex === i;

                    return <React.Fragment key={i}>{
                        tools.isArray((item as IMenuItemsProps).items) ? 
                            <MenuItemGroup {...(item as IMenuItemsProps)} targetItems={subItemsREl} active={active} onChange={this.handleGroupChange}/> : 
                            <MenuItem {...(item as IMenuItemProps)} onChange={this.handleChange} name={inputTagName} multiSelect={multiSelect}/>
                    }</React.Fragment>;
                })
            }</div>
            {
                subItemsREl ? 
                    <div className={tools.classNames(cssModules.items, cssModules['active-sub-items'])}>{subItemsREl}</div> : ''
            }
            </React.Fragment>
    }
    private renderActiveSubItems(activeItemGroup: IMenuItemsProps): JSX.Element {
        let { id, items, multiSelect, activeIndex } = activeItemGroup;

        if (multiSelect === undefined) {
            multiSelect = this.props.multiSelect;
        }

        return <MenuItems id={id} label={activeItemGroup.label} items={items} multiSelect={multiSelect} activeIndex={activeIndex} onChange={this.handleSubItemsChange}/>;
    }
    private handleGroupChange(e: ChangeEvent) {
        let { id, items, onChange } = this.props;

        onChange && onChange({
            id, 
            activeIndex: items.findIndex(item => (item as IMenuItemsProps).id === e.id)
        });
    }
    private handleSubItemsChange(e: any) {
        let { id, items, onChange } = this.props;

        onChange && onChange({
            id, 
            checked: [e], 
            activeIndex: items.findIndex(item => (item as IMenuItemsProps).id === e.id)
        });
    }
    private handleChange(e: IMenuItemChangeEvent) {
        let { id, items, onChange } = this.props;

        onChange && onChange({
            id, 
            checked: [e], 
            // activeIndex: items.findIndex(item => (item as IMenuItemProps).value === e.value)
        });
    }
}