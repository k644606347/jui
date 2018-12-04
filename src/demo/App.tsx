import * as React from 'react';

import './App.scss';
import Hello from '../components/Hello';

import { FormWidgetTest } from './FormWidget.test';
import FormDemo from './FormDemo';
import { Icon, Tools, Menu, Button, Pagination, List, Log, JUIApp, Toast, FormItem } from '..';
import { IconProps } from '../components/Icon';
import MessageTest from './Message.test';
import MultiContextProvider from './context/MultiContextProvider';
import HTMLForm from './RawForm';
import ModalDemo from './ModalDemo';
// import MenuDemo from './MenuDemo';
import NavBarDemo from './NavBarDemo';
import ListDemo from './ListDemo';
import cm from "./index.scss";
import RowTagNestedDemo from './NestedRowTagDemo';
import ToastDemo from './ToastDemo';
import { iconAddCircle, iconAddCircleOutline, iconAlert, iconInfo, iconMore } from '../components/icons/SVGData';
import MenuDemo from './MenuDemo';

window.console.log(process.env.NODE_ENV);
const tools = Tools.getInstance();
class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    public render() {
        return (
            <JUIApp className={'App'}>
                <ToastDemo />
                <NavBarDemo />
                <RowTagNestedDemo />
                <MessageTest />
                <FormWidgetTest />
                <FormDemo />
                <HTMLForm />
                <MenuDemo />
                {/* <MenuDemo /> */}
                <Button>btn1</Button>
                <Button type={'primary'} icon={iconMore}>btn2</Button>
                <Button type="warning" size="large" loading={true}>btn3</Button>
                <Button icon={<Icon style={{ marginRight: '20px' }} icon={iconAddCircleOutline} />} disabled={true}>disabled btn</Button>
                <Button type="dashed" size="small">small btn</Button>
                <Button size="large">large btn</Button>
                <Button loading={true} icon='cloud' inline={true}>inline btn</Button>
                <Button shape="circle" loading={true} inline={true} size="large">btn4</Button>
                <Button className="body-btn" type={'primary'}>custom className</Button>
                <Icon icon={iconAlert} rotation={90} flip="vertical" pulse={true} spin={true} />
                <Icon icon={iconInfo} rotation={90} flip="vertical" pulse={true} spin={true} />
                <Icon icon={iconAddCircle} rotation={90} flip="vertical" pulse={true} spin={true} />
                <Pagination current={1} total={20} disabled={true} />
                <Pagination current={21} total={20} disabled={true} />
                <ModalDemo/>
                <ListDemo/>
                <a href="www.baidu.com">link1</a>
                <a onClick={this.link2}>link2</a>
                <Hello name="TypeScript" enthusiasmLevel={10} />
                <MultiContextProvider />
                <FormItem label="test" component="test" layout="vertical"></FormItem>
            </JUIApp>
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
