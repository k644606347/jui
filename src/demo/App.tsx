import * as React from 'react';

import './App.scss';
import Hello from '../components/Hello';

import FormDemo from './FormDemo';
import { Icon, Tools, Menu, Button, Pagination, List, Log, JUIApp, Toast, FormItem, Input } from '..';
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
import DefaultPropsDemo from './DefaultPropsDemo';
import SearchBarDemo from './SearchBarDemo';
import ActiveFormApp from './activeForm/App';
import ButtonDemo from './button/ButtonDemo';

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    public render() {
        return (
            <JUIApp className={'App'}>
                <ButtonDemo />
                <ToastDemo />
                <NavBarDemo />
                <SearchBarDemo />
                {/* <RowTagNestedDemo /> */}
                <MessageTest />
                {/* <FormWidgetTest /> */}
                {/* <FormDemo /> */}
                <ActiveFormApp />
                <HTMLForm />
                <MenuDemo />
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
                <FormItem label="test" field={<input type="select" />} layout="vertical"></FormItem>
                <DefaultPropsDemo />
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
