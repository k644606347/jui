import * as React from 'react';
import './components/style/common.scss';

import './App.css';
import Hello from './components/Hello';

import Button from './components/Button';
import logo from './logo.svg';
import Icon, { IconProps } from './components/Icon';
import { icon500px_brand, iconAccessibleIcon_brand, iconAddressBook_solid, iconThList_solid } from './components/icons/FontAwesomeMap';
import List from './components/List';
import favoriteIcon from './favicon.ico';
import Pagination from './components/Pagination';
import Menu from './components/Menu';
import Tools from './utils/Tools';

window.console.log('icon:', (<Icon icon={iconThList_solid} /> as React.ReactElement<IconProps>).type === Icon, icon500px_brand);
const tools = Tools.getInstance();
class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            menu: {
                activeIndex: 1,
                items: [
                    { value: 'item1', label: 'item1', checked: false },
                    {
                        id: 'items1', label: 'items1', 
                        items: [
                                { 
                                    value: 'item2', label: 'item2', checked: false,
                                    icon: iconAccessibleIcon_brand,
                                },
                                { 
                                    value: 'item3', label: 'item3', checked: false,
                                    icon: <Icon icon={iconThList_solid} spin={true} />
                                }
                            ] 
                    }
                ],
            }
        };

        this.handleMenuChange = this.handleMenuChange.bind(this);
    }
    public handleMenuChange(e: any) {
        let { menu } = this.state;

        // tslint:disable-next-line:no-shadowed-variable
        function setItems(menu: any, event: any) {
            let itemIsModified = false,
                { items } = menu,
                { checked, activeIndex } = event;

            Array.isArray(checked) && checked.forEach((v: any) => {
                let id = v.id || v.value,
                    item = items.find((itm: any) => itm.id === id || itm.value === id);

                if (item === undefined) {
                    return;
                }
                if (tools.isArray(v.checked)) {
                    let result = setItems(item, v);
                    if (item !== result) {
                        itemIsModified = true;
                    }
                } else {
                    item.checked = v.checked;
                    item = {...item};
                    itemIsModified = true;
                    window.console.log(item);
                }
            });
            if (itemIsModified) {
                menu.items = [...menu.items];
                menu = {...menu};
            }
            if (activeIndex >= 0) {
                menu.activeIndex = activeIndex;
            }
            
            return menu;
        }

        window.console.log(e);

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
                <Menu id={'menu1'} multiSelect={true} label={'ddd'} level={2} {...menu} onChange={this.handleMenuChange} />
                <Button>btn1</Button>
                <Button type={'primary'}>btn2</Button>
                <Button type="warning" size="large" loading={true}>btn3</Button>
                <Button icon={<React.Fragment><Icon style={{ marginRight: '20px' }} icon={icon500px_brand} /></React.Fragment>} disabled={true}>disabled btn</Button>
                <Button type="dashed" size="small">small btn</Button>
                <Button size="large">large btn</Button>
                <Button loading={true} icon='cloud' inline={true}>inline btn</Button>
                <Button shape="circle" loading={true} inline={true} size="large">btn4</Button>
                <Button className="body-btn" type={'primary'}>custom className</Button>
                <Icon icon={icon500px_brand} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
                <Icon icon={iconAccessibleIcon_brand} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
                <Icon icon={iconAddressBook_solid} size="2x" rotation={90} flip="vertical" border={true} pulse={true} spin={true} />
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
    private link2(e: any) {
        window.alert(e);
    }
}
export default App;
