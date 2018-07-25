import * as React from "react";
import { IMenuItemsProps } from "./MenuItemsType";
import cssModules from './MenuItems.scss';
import Tools from "../utils/Tools";
import Icon, { iconChevronRight_solid } from "./Icon";
import MenuItem from "./MenuItem";
import { IMenuItemChangeEvent, IMenuItemProps } from "./MenuItemType";

const tools = Tools.getInstance();
// todo checked mutiple
export default class MenuItems extends React.PureComponent<IMenuItemsProps, any> {
    private static defaultProps: IMenuItemsProps = {
        id: tools.genID(),
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
            activeItemGroup = (activeItem && tools.isArray((activeItem as IMenuItemsProps).items)) ? (activeItem as IMenuItemsProps) : undefined,
            inputTagName = `${id}_${tools.genID()}`;

        return <React.Fragment>
            <div className={cssModules.items}>{
                items.map((item, i) => {
                    let active = activeIndex === i;

                    return <React.Fragment key={i}>{
                        tools.isArray((item as IMenuItemsProps).items) ? this.renderItemGroup(item as IMenuItemsProps, active) : 
                            <MenuItem {...(item as IMenuItemProps)} onChange={this.handleChange} name={inputTagName} multiSelect={multiSelect}/>
                    }</React.Fragment>;
                })
            }</div>
            {
                activeItemGroup ? 
                    <div className={cssModules.items}>{
                        this.renderActiveGroup(activeItemGroup)
                    }</div> : ''
            }
            </React.Fragment>
    }
    public renderActiveGroup(activeItemGroup: IMenuItemsProps): JSX.Element {
        let { id, items, multiSelect, activeIndex } = activeItemGroup;

        if (multiSelect === undefined) {
            multiSelect = this.props.multiSelect;
        }

        return <MenuItems id={id} label={activeItemGroup.label} items={items} multiSelect={multiSelect} activeIndex={activeIndex} onChange={this.handleGroupChange}/>;
    }
    public renderItemGroup(itemGroup: IMenuItemsProps, actived: boolean = false): JSX.Element {
        let { className, style, label, icon, multiSelect } = itemGroup;

        return <div className={tools.classNames(cssModules['item-group'], actived && cssModules['active-item-group'], className)} style={style}>
            {Icon.renderIcon(icon)}{label}<Icon icon={iconChevronRight_solid} />
        </div>;
    }

    public handleGroupChange(e: any) {
        let { id, items, onChange } = this.props;

        onChange && onChange({
            id, 
            checked: [e], 
            activeIndex: items.findIndex(item => (item as IMenuItemsProps).id === e.id)
        });
    }
    public handleChange(e: IMenuItemChangeEvent) {
        let { id, items, onChange } = this.props;

        onChange && onChange({
            id, 
            checked: [e], 
            activeIndex: items.findIndex(item => (item as IMenuItemProps).value === e.value)
        });
    }
}