import * as React from "react";
import { iconReturnLeft, iconShare, iconClose, iconSearch, iconList, iconAddCircle } from "../components/icons/SVGData";
import Button from "../components/Button";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import Icon from "../components/Icon";
import Log from "../utils/Log";

export default class NavBarDemo extends React.PureComponent<any, any> {
    state = {
        show: false,
    };
    render() {
        return (
            <React.Fragment>
                <Button type={'primary'} icon={iconAddCircle} onClick={
                    e => this.setState({ show: true })
                }>Nav Demo</Button>
                <Modal show={this.state.show} onOk={
                    e => this.setState({ show: false })
                } onClose={
                    e => this.setState({ show: false })
                }>
                    <React.Fragment>
                        <NavBar leftContent={
                            <Icon icon={iconReturnLeft} />
                        } rightContent={<Button>确定</Button>} onLeftClick={
                            e => Log.log('后退')
                        }>导航栏，浅色主题</NavBar>
                        <NavBar theme={'dark'} leftContent={
                            <Icon icon={iconShare} />
                        } rightContent={'确定'} onLeftClick={
                            e => Log.log('后退')
                        }>导航栏，深色主题</NavBar>
                        <NavBar theme={'dark'} leftContent={
                            <React.Fragment>
                                <Icon icon={iconClose} />
                                <Icon icon={iconSearch} />
                                <Icon icon={iconList} />
                            </React.Fragment>
                        } rightContent={'确定'} onLeftClick={
                            e => Log.log('后退')
                        }></NavBar>
                        <NavBar leftContent={''}><input type={'search'} />取消</NavBar>
                    </React.Fragment>
                </Modal>
            </React.Fragment>
        )
    }
}