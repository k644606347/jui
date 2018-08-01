import { IMenuProps, IMenuState } from "./MenuType";
import * as React from "react";
import cssModules from './Menu.scss';
import Tools from "../utils/Tools";
import Icon from "./Icon";
import MenuItems from "./MenuItems";

const tools = Tools.getInstance();
export default class Menu extends React.PureComponent<IMenuProps, IMenuState> {
    public static updateItemsLayout() {
        Menu.instances.forEach(ins => {
            if (ins.props.showItems) {
                ins.setState({
                    itemsRect: ins.genItemsRect()
                });
            }
        });
    }
    public static updateMenuBackdrop() {
        Menu.instances.forEach(ins => {
            let { showItems, backdrop } = ins.props,
                { backdropRect } = ins.state,
                nextBackdropRect = ins.genBackdropRect(),
                maxOffset = 10;

            if (!showItems || !backdrop) {
                return;
            }

            // 小于偏移量的scroll移动不做处理
            if (Math.abs(backdropRect.top - nextBackdropRect.top) < maxOffset) {
                return;
            }
            ins.setState({ backdropRect: nextBackdropRect });
        })
    }
    private static instances: Menu[] = [];
    private static defaultProps: IMenuProps = {
        id: tools.genID(),
        label: '',
        items: [],
        activeIndex: 0,
        showItems: false,
        multiSelect: false,
        level: 1,
        backdrop: true,
        backdropClick: false,
        backdropCoverage: 'full',
    };
    constructor(props: IMenuProps) {
        super(props);

        this.state = {
            itemsRect: {
                top: 0,
                left: 0,
            },
            backdropRect: {
                top: 0,
                left: 0
            },
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }
    public render() {
        let { props, state } = this,
            { id, label, className, showItems, style, icon, items, level, activeIndex, multiSelect, backdrop, backdropClick } = props,
            { itemsRect, backdropRect } = state;

        return <React.Fragment>
            <div className={cssModules['menu-wrap']}>
                <div ref='menuBtn' style={style} className={tools.classNames(cssModules['menu-btn'], className)} onClick={this.handleBtnClick}>{Icon.renderIcon(icon)}{label}</div>
                <div className={cssModules['menu-items-root']} style={{ display: showItems ? 'block' : 'none' }}>
                    <div style={itemsRect} className={cssModules['menu-items-wrap']}>
                        <MenuItems id={id} label={label} activeIndex={activeIndex} items={items} multiSelect={multiSelect} level={level} onChange={this.handleChange} />
                    </div>
                    {backdrop ? <div className={cssModules['menu-items-wrap-backdrop']} style={backdropRect} onClick={backdropClick ? this.handleBackdropClick : undefined}></div> : ''}
                </div>
            </div>
        </React.Fragment>;
    }
    public componentDidMount() {
        let { backdrop, showItems } = this.props,
            nextState = {} as IMenuState;

        if (showItems) {
            nextState.itemsRect = this.genItemsRect();

            if (backdrop) {
                nextState.backdropRect = this.genBackdropRect();
            }

            this.setState(nextState);
        }
        Menu.instances.push(this);
    }
    public componentDidUpdate(prevProps: IMenuProps) {
        let { showItems, backdrop } = this.props,
            nextState = {} as IMenuState,
            needUpdateItemsLayout = false,
            needUpdateBackdropLayout = false;

        // window.console.log('componentDidUpdate');
        if (showItems) {
            if (showItems !== prevProps.showItems) {
                needUpdateItemsLayout = true;
            }

            if (backdrop) {
                if (showItems !== prevProps.showItems || backdrop !== prevProps.backdrop) {
                    needUpdateBackdropLayout = true;
                }
            }
        }
        if (needUpdateItemsLayout) {
            nextState.itemsRect = this.genItemsRect();
        }
        if (needUpdateBackdropLayout) {
            nextState.backdropRect = this.genBackdropRect();
        }

        !tools.isEmptyObject(nextState) && this.setState(nextState);
    }
    public componentWillUnmount() {
        let index = Menu.instances.findIndex(instance => instance === this);

        if (index !== -1) {
            Menu.instances.splice(index, 1);
        }
    }
    private genItemsRect() {
        let menuBtnRect = this.getMenuBtnRect(),
            xOffset = 0 - menuBtnRect.left,
            yOffset = 0,
            { itemsRect } = this.state;

        if (itemsRect.top === yOffset && itemsRect.left === xOffset) {
            return itemsRect;
        }

        return {
            top: yOffset,
            left: xOffset
        }
    }
    private genBackdropRect() {
        let { backdropCoverage } = this.props,
            menuBtnRect = this.getMenuBtnRect(),
            style = {
                top: 0 - (menuBtnRect.top + menuBtnRect.height),
                left: 0 - menuBtnRect.left,
            };

        if (menuBtnRect.top <= 0) {
            return style;
        }
        
        if (backdropCoverage === 'bottom') {
            style.top = menuBtnRect.height;
        }

        return style;
    }
    private getMenuBtnRect() {
        return (this.refs.menuBtn as HTMLElement).getBoundingClientRect()
    }
    private handleChange(e: any) {
        let { onChange } = this.props;

        // window.console.log('Menu handleChange event',e);
        onChange && onChange(e);
    }
    private handleBtnClick(e: React.MouseEvent) {
        let { showItems } = this.props;

        !showItems ? this.handleShow() : this.handleHide();
    }
    private handleBackdropClick(e: React.MouseEvent) {
        let { showItems } = this.props;

        !showItems ? this.handleShow() : this.handleHide();
    }
    private handleShow() {
        let { onShow } = this.props;

        onShow && onShow();
    }
    private handleHide() {
        let { onHide } = this.props;

        onHide && onHide();
    }
}

Menu.updateItemsLayout = Menu.updateItemsLayout.bind(Menu);
Menu.updateMenuBackdrop = Menu.updateMenuBackdrop.bind(Menu);

const win = window, addEvent = win.addEventListener;
let backdropTimer: number = 0;

// 标签上的scroll event不会触发冒泡，此处在捕获阶段处理逻辑
addEvent('scroll', e => {
    // window.console.log('scroll capture event');
    if (backdropTimer) {
        clearTimeout(backdropTimer);
    }
    backdropTimer = win.setTimeout(() => {
        Menu.updateMenuBackdrop();
        backdropTimer = 0;
    }, 100);
}, true);
addEvent('resize', Menu.updateItemsLayout, false);