import { IMenuProps, ItemGroupData, ItemData } from "./Menu";
import * as React from "react";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import { iconChevronRight_solid } from "./icons/FontAwesomeMap";
import * as ReactDOM from "react-dom";
import MenuItems from "./MenuItems";

const tools = Tools.getInstance();
export default class Menu extends React.PureComponent<IMenuProps, any> {
    private itemsWrapTag: HTMLElement;
    private itemsTag: JSX.Element;
    constructor(props: IMenuProps) {
        super(props);

    }
    public render() {
        let { props } = this,
            { items, className, style, icon } = props;

        return <React.Fragment>
            <div ref='menuBtn' style={style} className={tools.classNames(cssModules['menu-btn'], className)}>{
                icon ? <Icon icon={icon} /> : ''
            }</div>
        </React.Fragment>;
    }
    public componentDidMount() {
        this.buildItemsWrap();
        this.calcItemsPosition();
    }
    public componentDidUpdate() {
        this.buildItemsWrap();
        this.calcItemsPosition();
    }
    public buildItemsWrap() {
        let { items } = this.props,
            itemsTag = this.itemsTag,
            itemsWrapTag = this.itemsWrapTag;

        if (itemsTag) {
            itemsTag = React.cloneElement(itemsTag, { items });
        } else {
            itemsTag = <MenuItems items={items} onChange={this.handleChange}/>;
            itemsWrapTag =  document.createElement('div');

            itemsWrapTag.classList.add(cssModules['menu-items-wrap']);
            document.body.appendChild(itemsWrapTag);
            ReactDOM.render(itemsTag, itemsWrapTag);

            this.itemsWrapTag = itemsWrapTag;
        }
        this.itemsTag = itemsTag;
    }
    public calcItemsPosition() {
        let { items, menuBtn } = this.refs,
            menuBtnRect = (menuBtn as HTMLElement).getBoundingClientRect(),
            itemsStyle;

        itemsStyle = (items as HTMLElement).style;
        itemsStyle.top = menuBtnRect.top + 'px';
        // itemsStyle.left = menuBtnRect.left + 'px';
    }
    public handleChange(e: Event) {
        let { onChange } = this.props;

        onChange && onChange({});
    }
}