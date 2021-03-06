import * as React from "react";
import { MenuItemsChangeEvent } from "src/components/MenuItemsType";
import { MenuItemProps } from "src/components/MenuItemType";
import { iconCar, iconCalculator, iconHtml5, iconCss3, iconJavascript, iconNodejs, iconPython, iconWindows } from "../components/icons/SVGData";
import Icon from "../components/Icon";
import Menu from "../components/Menu";
import { tools } from "../utils/Tools";

export default class MenuDemo extends React.PureComponent<any,any> {
    constructor(props: any) {
        super(props);

        let that = this,
            showItems = false;

        this.state = {
            menu: {
                label: `我是Menu1我默认${showItems ? '打开' : '关闭'}`,
                showItems,
                multiSelect: false,
                onShow() {
                    that.setState({ menu: { ...that.state.menu, showItems: true } });
                },
                onHide() {
                    that.setState({ menu: { ...that.state.menu, showItems: false } });
                },
                activeIndex: 3,
                items: [
                    { value: 'item1', label: '新建', checked: false },
                    { value: 'item2', label: 'item2', checked: true },
                    { value: 'item3', label: 'item3待ICON', checked: false, icon: iconCar },
                    {
                        id: 'items1', label: 'items1 label很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
                        items: [
                            {
                                value: 'item1.1', label: 'item1.1', checked: false,
                                icon: iconCalculator,
                            },
                            {
                                value: 'item1.2', label: 'item1.2', checked: false,
                                icon: <Icon icon={iconHtml5} spin={true} />
                            }
                        ]
                    },
                    {
                        id: 'items2',
                        label: 'items2是多选',
                        multiSelect: true,
                        items: [
                            {
                                value: 'item2.1', label: 'item2.1', checked: false,
                                icon: iconCss3,
                            },
                            {
                                value: 'item2.2', label: 'item2.2', checked: false,
                                icon: <Icon icon={iconJavascript} spin={true} />
                            }
                        ]
                    },
                    {
                        id: 'items3',
                        label: 'items3带ICON',
                        multiSelect: true,
                        icon: iconNodejs,
                        items: [
                            {
                                value: 'item3.1', label: 'item3.1', checked: false,
                                icon: iconPython,
                            },
                            {
                                value: 'item3.2', label: 'item3.2', checked: false,
                                icon: <Icon icon={iconWindows} spin={true} />
                            }
                        ]
                    }
                ],
                backdropCoverage: 'bottom',
            }
        };
    }
    render() {
        let { menu } =  this.state;

        return (
            <React.Fragment>
                <Menu id={'menu1'} level={2} {...menu} onChange={this.handleMenuChange} />
            </React.Fragment>
        );
    }
    handleBtnClick = (e: React.MouseEvent) => {
        let { modalProps } = this.state;

        modalProps = {...modalProps, show: !modalProps.show};
        this.setState({ modalProps });
    }
    handleMenuChange = (e: MenuItemsChangeEvent) => {
        let { menu } = this.state;

        function setItems(menu: any, event: MenuItemsChangeEvent) {
            let itemIsModified = false,
                { items, multiSelect, activeIndex } = event;

            Array.isArray(items) && items.forEach((v: any) => {
                let id = v.id || v.value,
                    item = menu.items.find((itm: any) => itm.id === id || itm.value === id);

                if (item === undefined) {
                    return;
                }
                if (tools.isArray(v.items)) {
                    let result = setItems(item, v);
                    if (item !== result) {
                        itemIsModified = true;
                    }
                } else {
                    if (!multiSelect) {
                        let nextItems: MenuItemProps[] = [];
                        menu.items.forEach((itm: MenuItemProps) => {
                            nextItems.push({ ...itm, checked: false });
                        });
                        menu.items = nextItems;

                        item = menu.items.find((itm: any) => itm.id === id || itm.value === id);
                    }

                    item.checked = v.checked;
                    item = { ...item };
                    itemIsModified = true;
                    // window.console.log(item);
                }
            });
            if (itemIsModified) {
                menu.items = [...menu.items];
                menu = { ...menu };
            }
            if (activeIndex && activeIndex >= 0) {
                menu.activeIndex = activeIndex;
            }

            return menu;
        }

    window.console.log('Menu ChangeEvent: ', e);

        menu = setItems(menu, e);
        this.setState({ menu });
    }
}