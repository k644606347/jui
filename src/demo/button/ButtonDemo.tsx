import * as React from "react";

import { Button, Icon, Modal } from "../..";
import demoCSS from './ButtonDemo.scss';
import { iconMore, iconAddCircleOutline, iconClipboard, icon1212, iconAdd } from "../../components/icons/SVGData";

export default class ButtonDemo extends React.PureComponent<any, any>{
    readonly state = {
        show: false,
    };
    render() {
        return (
            <React.Fragment>
                <Button type={'primary'} icon={iconClipboard} onClick={
                    e => this.setState({ show: true })
                }>Button Demo</Button>
                <Modal show={this.state.show} onOk={
                    e => this.setState({ show: false })
                } onCancel={
                    e => this.setState({ show: false })
                }>
                    <h2>空button</h2>
                    <Button></Button>
                    <h2>常规</h2>
                    <Button icon={<Icon icon={iconAdd} spin />} title="normal btn">normal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btnnormal btn</Button>
                    <Button icon={<Icon icon={iconAdd} pulse />} title="normal btn"><span>normal btn</span></Button>
                    <Button icon={<Icon icon={icon1212} />} title="normal btn">normal btn</Button>
                    <Button type={'primary'} icon={iconMore} block={false}>primary btn</Button>
                    <Button type="danger" size="large" loading>danger btn</Button>
                    <Button type="danger" size="large" loading>danger btn</Button>
                    <Button type="danger" size="large" disabled loading>danger btn</Button>
                    <Button icon={<Icon style={{ marginRight: '20px' }} icon={iconAddCircleOutline} />} disabled>disabled btn</Button>
                    <Button size="large">large btn</Button>
                    <Button size="small">small btn</Button>
                    {/* <Button theme="dark" icon='time-circle'>dark btn</Button> */}
                    <Button loading icon='cloud' block>block btn</Button>
                    <Button type="primary" icon='search' block>block btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btnblock btn</Button>
                    <Button type="primary" icon="check-circle" full>full btn</Button>
                    <Button type="danger" icon='cloud' block disabled>disabled danger btn</Button>
                    {/* <Button theme="dark" icon='time-circle' block>dark btn</Button> */}
                    <Button shape="circle" loading size="large"></Button>
                    <Button type="primary" shape="circle" loading block size="large">btn4</Button>
                    <Button type="danger" shape="circle" loading block size="large">btn4</Button>
                    <Button className={demoCSS.btn} activeClassName={demoCSS.active} type={'primary'}>custom className</Button>
                    <h2>outline</h2>
                    <Button outline>normal btn</Button>
                    <Button type={'primary'} outline icon={iconMore} block={false}>primary btn</Button>
                    <Button outline type="danger" size="large" loading>danger btn</Button>
                    <Button outline icon={<Icon style={{ marginRight: '20px' }} icon={iconAddCircleOutline} />} disabled>disabled btn</Button>
                    <Button outline size="large">large btn</Button>
                    <Button outline size="small">small btn</Button>
                    {/* <Button outline theme="dark" icon='time-circle'>dark btn</Button> */}
                    <Button outline loading icon='cloud' block>block btn</Button>
                    <Button outline type="primary" icon='search' block>block btn</Button>
                    <Button outline type="primary" icon="check-circle" full>full btn</Button>
                    <Button outline type="danger" icon='cloud' block disabled>disabled danger btn</Button>
                    {/* <Button outline theme="dark" icon='time-circle' block>dark btn</Button> */}
                    <Button outline shape="circle" loading block size="large">btn4</Button>
                    <Button outline type="primary" shape="circle" loading block size="large">btn4</Button>
                    <Button outline type="danger" shape="circle" loading block size="large">btn4</Button>
                    <h2>clear</h2>
                    <Button clear>normal btn</Button>
                    <Button type={'primary'} clear icon={iconMore} block={false}>primary btn</Button>
                    <Button clear type="danger" size="large" loading>danger btn</Button>
                    <Button clear icon={<Icon style={{ marginRight: '20px' }} icon={iconAddCircleOutline} />} disabled>disabled btn</Button>
                    <Button clear size="large">large btn</Button>
                    <Button clear size="small">small btn</Button>
                    {/* <Button clear theme="dark" icon='time-circle'>dark btn</Button> */}
                    <Button clear loading icon='cloud' block>block btn</Button>
                    <Button clear type="primary" icon='search' block>block btn</Button>
                    <Button clear type="primary" icon="check-circle" full>full btn</Button>
                    <Button clear type="danger" icon='cloud' block disabled>disabled danger btn</Button>
                    {/* <Button clear theme="dark" icon='time-circle' block>dark btn</Button> */}
                    <Button clear shape="circle" loading block size="large">btn4</Button>
                    <Button clear type="primary" shape="circle" loading block size="large">btn4</Button>
                    <Button clear type="danger" shape="circle" loading block size="large">btn4</Button>
                    <h2>disabled</h2>
                    <Button disabled>normal btn</Button>
                    <Button disabled type={'primary'} icon={iconMore} block={false}>primary btn</Button>
                    <Button disabled type="danger" size="large" loading>danger btn</Button>
                    <Button disabled icon={<Icon style={{ marginRight: '20px' }} icon={iconAddCircleOutline} />}>disabled btn</Button>
                    <Button disabled size="large">large btn</Button>
                    <Button disabled size="small">small btn</Button>
                    {/* <Button disabled theme="dark" icon='time-circle'>dark btn</Button> */}
                    <Button disabled loading icon='cloud' block>block btn</Button>
                    <Button disabled type="primary" icon='search' block>block btn</Button>
                    <Button disabled type="primary" icon="check-circle" full>full btn</Button>
                    <Button disabled type="danger" icon='cloud' block>disabled danger btn</Button>
                    {/* <Button disabled theme="dark" icon='time-circle' block>dark btn</Button> */}
                    <Button disabled shape="circle" loading block size="large">btn4</Button>
                    <Button disabled type="primary" shape="circle" loading block size="large">btn4</Button>
                    <Button disabled type="danger" shape="circle" loading block size="large">btn4</Button>
                </Modal>
            </React.Fragment>
        )
    }
}