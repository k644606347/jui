import { IMenuProps, IMenuState } from "./MenuType";
import * as React from "react";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import * as ReactDOM from "react-dom";
import MenuItems from "./MenuItems";

const tools = Tools.getInstance();
export default class Menu extends React.PureComponent<IMenuProps, IMenuState> {
    private static defaultProps: IMenuProps = {
        name: tools.genID(),
        label: '',
        items: [],
        showItems: false,
        level: 1,
        multiple: false,
        activeIndex: 0,
    };
    constructor(props: IMenuProps) {
        super(props);

        this.state = {
            showItems: props.showItems || false,
            itemsRect: {
                top: 0,
                left: 0,
            },
        };

        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { props, state } = this,
            { name, label, className, style, icon, items, level, activeIndex } = props,
            { itemsRect, showItems } = state;

        return <React.Fragment>
            <div className={cssModules['menu-wrap']}>
                <div ref='menuBtn' style={style} className={tools.classNames(cssModules['menu-btn'], className)} onClick={this.handleBtnClick}>{Icon.renderIcon(icon)}{label}</div>
                <div className={cssModules['menu-items-root']} style={{display: showItems ? 'block' : 'none'}}>
                    <div style={itemsRect} className={cssModules['menu-items-wrap']}>
                        <MenuItems name={name} label={label} level={level} items={items} activeIndex={activeIndex} onChange={this.handleChange} />
                    </div>
                    <div className={cssModules['menu-items-wrap-backdrop']}></div>
                </div>
            </div>
        </React.Fragment>;
    }
    public componentDidMount() {
        this.setItemsPosition();
    }
    public componentDidUpdate() {
        let { showItems } = this.state;

        if (showItems) {
            this.setItemsPosition();
        }
    }
    public setItemsPosition() {
        let menuBtnRect = this.getMenuBtnRect(),
            xOffset = 0 - menuBtnRect.left,
            yOffset = 0,
            { itemsRect } = this.state;

        if (itemsRect.top === yOffset && itemsRect.left === xOffset) {
            return;
        }
        
        this.setState({
            itemsRect: {
                top: yOffset,
                left: xOffset,
            },
        });
    }
    public getMenuBtnRect() {
        return (this.refs.menuBtn as HTMLElement).getBoundingClientRect()
    }
    public handleChange(e: any) {
        let { onChange } = this.props;

        // window.console.log('Menu handleChange event',e);
        onChange && onChange(e);
    }
    private handleBtnClick(e: React.MouseEvent | React.KeyboardEvent) {
        this.setState({ showItems: !this.state.showItems });
    }
}