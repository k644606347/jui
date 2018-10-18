import * as React from 'react';

import './App.css';
import Hello from '../components/Hello';

import logo from './logo.svg';
import favoriteIcon from './favicon.ico';
import { FormWidgetTest } from './FormWidget.test';
import FormTest from './Form.test';
import { Icon, Tools, Menu, Button, Pagination, List, Log } from 'src/index';
import { IconProps } from '../components/Icon';
import { iconThList, icon500px, iconAccessibleIcon, iconAddressBook } from '../components/icons/FontAwesomeMap';
import MessageTest from './Message.test';
import MultiContextProvider from './context/MultiContextProvider';
import HTMLForm from './RawForm';
import ModalDemo from './ModalDemo';
import MenuDemo from './MenuDemo';

window.console.log('icon:', (<Icon icon={iconThList} /> as React.ReactElement<IconProps>).type === Icon, icon500px);
const tools = Tools.getInstance();
class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
                <MessageTest />
                {/* <input type="text" style={{position: 'fixed', zIndex: 30  }} /> */}
                <FormWidgetTest />
                <FormTest />
                <HTMLForm />
                <MenuDemo />
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
                <MultiContextProvider />
                <ModalDemo/>
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
