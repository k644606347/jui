import * as React from 'react';
import '../components/style/common.scss';

import './App.css';
import Hello from '../components/Hello';

import Button from '../components/Button';
import logo from './logo.svg';
import Icon, { IconProps } from '../components/Icon';
import { icon500px, iconAccessibleIcon, iconAddressBook, iconThList, iconAdn, iconBan, iconDribbble, iconCarBattery, iconInfo } from '../components/icons/FontAwesomeMap';
import List from '../components/List';
import favoriteIcon from './favicon.ico';
import Pagination from '../components/Pagination';
import Menu from '../components/Menu';
import Tools from '../utils/Tools';
import { MenuItemsChangeEvent } from '../components/MenuItemsType';
import { MenuItemProps } from '../components/MenuItemType';
import { FormWidgetTest } from './FormWidget.test';
import FormTest from './Form.test';

window.console.log('icon:', (<Icon icon={iconThList} /> as React.ReactElement<IconProps>).type === Icon, icon500px);
const tools = Tools.getInstance();
class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        let that = this;

        this.state = {
            menu: {
                label: '我是Menu1我默认打开',
                showItems: true,
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
                    { value: 'item3', label: 'item3待ICON', checked: false, icon: iconCarBattery },
                    {
                        id: 'items1', label: 'items1 label很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
                        items: [
                            {
                                value: 'item1.1', label: 'item1.1', checked: false,
                                icon: iconAccessibleIcon,
                            },
                            {
                                value: 'item1.2', label: 'item1.2', checked: false,
                                icon: <Icon icon={iconThList} spin={true} />
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
                                icon: iconBan,
                            },
                            {
                                value: 'item2.2', label: 'item2.2', checked: false,
                                icon: <Icon icon={iconAdn} spin={true} />
                            }
                        ]
                    },
                    {
                        id: 'items3',
                        label: 'items3带ICON',
                        multiSelect: true,
                        icon: iconDribbble,
                        items: [
                            {
                                value: 'item3.1', label: 'item3.1', checked: false,
                                icon: iconBan,
                            },
                            {
                                value: 'item3.2', label: 'item3.2', checked: false,
                                icon: <Icon icon={iconAdn} spin={true} />
                            }
                        ]
                    }
                ],
                backdropCoverage: 'bottom',
            }
        };

        this.handleMenuChange = this.handleMenuChange.bind(this);
    }
    public handleMenuChange(e: MenuItemsChangeEvent) {
        let { menu } = this.state;

        // tslint:disable-next-line:no-shadowed-variable
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
    public render() {
        let { menu } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
                {/* <input type="text" style={{position: 'fixed', zIndex: 30  }} /> */}
                <FormWidgetTest />
                <FormTest />
                <Menu id={'menu1'} level={2} {...menu} onChange={this.handleMenuChange} />
                <Button>btn1</Button>
                <Button type={'primary'} icon={iconThList}>btn2</Button>
                <Button type="warning" size="large" loading={true}>btn3</Button>
                <Button icon={<Icon style={{ marginRight: '20px' }} icon={icon500px} />} disabled={true}>disabled btn</Button>
                <Button type="dashed" size="small">small btn</Button>
                <Button size="large">large btn</Button>
                <Button loading={true} icon='cloud' inline={true}>inline btn</Button>
                <Button shape="circle" loading={true} inline={true} size="large">btn4</Button>
                <Button className="body-btn" type={'primary'}>custom className</Button>
                <Icon icon={iconAccessibleIcon} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
                <Icon icon={iconAccessibleIcon} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
                <Icon icon={iconAddressBook} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
                <Pagination current={1} total={20} disabled={true} />
                <Pagination current={21} total={20} disabled={true} />
                <List dataSource={[
                    {
                        type: 'section',
                        title: 'section1',
                        data: [
                            {
                                type: 'row',
                                data: {
                                    id: 'baidu',
                                    name: 'biaduche',
                                }
                            }
                        ]
                    },
                    {
                        type: 'section',
                        title: 'section2',
                        data: [
                            {
                                type: 'row',
                                data: {
                                    id: 'baidu',
                                    name: 'biaduche',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                        ]
                    },
                    {
                        type: 'section',
                        title: 'section3',
                        data: [
                            {
                                type: 'row',
                                data: {
                                    id: 'baidu',
                                    name: 'biaduche',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                        ]
                    },
                    {

                        type: 'section',
                        title: 'section4',
                        data: [
                            {
                                type: 'row',
                                data: {
                                    id: 'baidu',
                                    name: 'biaduche',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                            {
                                type: 'row',
                                data: {
                                    id: '123121312131',
                                    name: 'liu1',
                                }
                            },
                        ]
                    },
                    {
                        type: 'row',
                        data: {
                            id: '123121312131',
                            name: 'liu1',
                        }
                    },
                    {
                        type: 'row',
                        data: {
                            id: '123121312131',
                            name: 'liu1',
                        }
                    },
                    {
                        type: 'row',
                        data: {
                            id: '123121312131',
                            name: 'liu1',
                        }
                    },
                    // tslint:disable-next-line:jsx-no-lambda
                ]} renderRow={(data) => {
                    return <div style={{ padding: '5px', display: 'flex', flexDirection: 'row' }}><img src={favoriteIcon} style={{ marginRight: '.5em' }} /><p>{`id = ${data.data.id}, name = ${data.data.name}`}</p></div>
                    // tslint:disable-next-line:jsx-no-lambda
                }} renderSectionBodyWrapper={(header, body) => <React.Fragment><div style={{ boxShadow: '0 0px 5px 2px #ccc' }}>{header}{body}</div></React.Fragment>}
                />
                <a href="www.baidu.com">link1</a>
                <a onClick={this.link2}>link2</a>
                <Hello name="TypeScript" enthusiasmLevel={10} />
            </div>
        );
    }
    handleFormChange = (e: any) => {
        let newform = [...this.state.form1];
        
        window.console.log('form change', e);

        newform.forEach((field, i) => {
            if (field.name === e.name) {
                this[i] = Object.assign(field, e);
            }
        });
        this.setState({
            form: newform
        });
    }
    private link2(e: any) {
        window.alert(e);
    }
}
export default App;
