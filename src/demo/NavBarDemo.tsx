import { NavBar, Icon, Log, Button, Modal } from "..";
import * as React from "react";
import { iconArrowLeft, iconSearch, iconList, iconInfoCircle } from "../components/icons/FontAwesomeMap";

export default class NavBarDemo extends React.PureComponent<any, any> {
    state = {
        show: false,
    };
    render() {
        return (
            <React.Fragment>
                <Button type={'primary'} icon={iconInfoCircle} onClick={
                    e => this.setState({ show: true })
                }>Nav Demo</Button>
                <Modal show={this.state.show} onOk={
                    e => this.setState({ show: false })
                } onClose={
                    e => this.setState({ show: false })
                }>
                    <React.Fragment>
                        <NavBar leftContent={
                            <Icon icon={iconArrowLeft} />
                        } rightContent={'确定'} onLeftClick={
                            e => Log.log('后退')
                        }>导航栏，浅色主题</NavBar>
                        <NavBar theme={'dark'} leftContent={
                            <Icon icon={iconArrowLeft} />
                        } rightContent={'确定'} onLeftClick={
                            e => Log.log('后退')
                        }>导航栏，深色主题</NavBar>
                        <NavBar theme={'dark'} leftContent={
                            <React.Fragment>
                                <Icon icon={iconArrowLeft} />
                                <Icon icon={iconSearch} />
                                <Icon icon={iconList} />
                            </React.Fragment>
                        } rightContent={'确定'} onLeftClick={
                            e => Log.log('后退')
                        }></NavBar>
                        <NavBar>默认导航</NavBar>
                    </React.Fragment>
                </Modal>
            </React.Fragment>
        )
    }
}