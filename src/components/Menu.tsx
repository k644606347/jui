import * as React from "react";
import Tools from "../utils/Tools";
import Icon from "./Icon";
import MenuItems from "./MenuItems";
import { MenuProps, MenuState } from "./MenuType";
import cssModules from './Menu.scss';

const tools = Tools.getInstance();

/**
 * 菜单栏组件, 样式定位以<body>元素为基准
 */
export default class Menu extends React.PureComponent<MenuProps, MenuState> {
    static handleLoad() {
        this.updateLayout();
    }
    static handleResize() {
        this.updateLayout();
    }
    static handleScroll() {
        Menu.instances.forEach(ins => {
            let { showItems, backdrop } = ins.props,
                { backdropStyle } = ins.state,
                nextBackdropStyle = ins.genBackdropStyle(),
                maxOffset = 10;

            if (!showItems || !backdrop) {
                return;
            }

            // 小于偏移量的scroll移动不做处理
            if (Math.abs(Number(backdropStyle.top) - Number(nextBackdropStyle.top)) < maxOffset) {
                return;
            }
            ins.setState({ backdropStyle: nextBackdropStyle });
        })
    }
    private static updateLayout(options?: Partial<MenuState>) {
        Menu.instances.forEach(ins => {
            let { showItems, backdrop } = ins.props,
                nextState: any = {};

            if (showItems) {
                nextState.itemsStyle = ins.genItemsStyle();
                
                if (backdrop) {
                    nextState.backdropStyle = ins.genBackdropStyle();
                }
                ins.setState(Object.assign(nextState, options));
            }
        });
    }
    private static instances: Menu[] = [];
    static defaultProps: Partial<MenuProps> = {
        id: 'menu',
        label: 'menu',
        items: [],
        activeIndex: 0,
        showItems: false,
        multiSelect: false,
        level: 1,
        backdrop: true,
        backdropClick: false,
        backdropCoverage: 'full',
    };
    public readonly state: MenuState = {
        itemsStyle: {
            top: 0,
            left: 0,
        },
        backdropStyle: {
            top: 0,
            left: 0
        },        
    }
    constructor(props: MenuProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }
    public render() {
        let { props, state } = this,
            { id, label, className, style, icon, items, showItems, level, activeIndex, multiSelect, backdrop, backdropClick } = props,
            { itemsStyle, backdropStyle } = state;

        return <React.Fragment>
            <div className={cssModules['menu-wrap']}>
                <div ref='menuBtn' style={style} className={tools.classNames(cssModules['menu-btn'], className)} onClick={this.handleBtnClick}>{icon && Icon.renderIcon(icon)}{label}</div>
                <div className={cssModules['menu-items-root']} style={{ display: this.didMount && showItems ? 'block' : 'none' }}>
                    <div style={itemsStyle} className={cssModules['menu-items-wrap']}>
                        <MenuItems id={`${id}_root_items`} label={label} activeIndex={activeIndex} items={items} multiSelect={multiSelect} level={level} onChange={this.handleChange} />
                    </div>
                    {backdrop ? <div className={cssModules['menu-items-wrap-backdrop']} style={backdropStyle} onClick={backdropClick ? this.handleBackdropClick : undefined}></div> : ''}
                </div>
            </div>
        </React.Fragment>;
    }
    private didMount:boolean = false;
    public componentDidMount() {
        let { backdrop, showItems } = this.props,
            nextState: any = {};

        this.didMount = true;
        if (showItems) {
            nextState.x = 1;
            nextState.itemsStyle = this.genItemsStyle();

            if (backdrop) {
                nextState.backdropStyle = this.genBackdropStyle();
            }

            this.setState(nextState);
        }
        Menu.instances.push(this);
    }
    public componentDidUpdate(prevProps: MenuProps) {
        let { showItems, backdrop } = this.props,
            nextState = {} as MenuState,
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
            nextState.itemsStyle = this.genItemsStyle();
        }
        if (needUpdateBackdropLayout) {
            nextState.backdropStyle = this.genBackdropStyle();
        }

        !tools.isEmptyObject(nextState) && this.setState(nextState);
    }
    public componentWillUnmount() {
        let index = Menu.instances.findIndex(instance => instance === this);

        if (index !== -1) {
            Menu.instances.splice(index, 1);
        }
    }
    private genItemsStyle() {
        let menuBtnRect = this.getMenuBtnRect(),
            rootRect = document.body.getBoundingClientRect(),
            xOffset = rootRect.left - menuBtnRect.left,
            yOffset = 0;

        return {
            top: yOffset,
            left: xOffset,
            width: rootRect.width,
        }
    }
    private genBackdropStyle() {
        let { backdropCoverage } = this.props,
            menuBtnRect = this.getMenuBtnRect(),
            rootRect = document.body.getBoundingClientRect(),
            style: React.CSSProperties = {
                top: 0 - (menuBtnRect.top + menuBtnRect.height),
                left: rootRect.left - menuBtnRect.left,
                width: rootRect.width,
            },
            menuBtnIsHidden = menuBtnRect.top + menuBtnRect.height <= 0;

        window.console.log(rootRect, menuBtnRect);
        if (menuBtnIsHidden) {
            return style;
        }
        
        if (backdropCoverage === 'bottom') {
            style.top = 0;
            style.height = `calc(100vh - ${menuBtnRect.top + menuBtnRect.height + 'px'})`;
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

Menu.handleResize = Menu.handleResize.bind(Menu);
Menu.handleScroll = Menu.handleScroll.bind(Menu);
Menu.handleLoad = Menu.handleLoad.bind(Menu);

const win = window, addEvent = win.addEventListener;
let backdropTimer: number = 0;

// 标签上的scroll event不会触发冒泡，此处在捕获阶段处理逻辑
addEvent('scroll', e => {
    // window.console.log('scroll capture event');
    if (backdropTimer) {
        clearTimeout(backdropTimer);
    }
    backdropTimer = win.setTimeout(() => {
        Menu.handleScroll();
        backdropTimer = 0;
    }, 80);
}, true);
addEvent('resize', Menu.handleResize);
addEvent('load', Menu.handleLoad);