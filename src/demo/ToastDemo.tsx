
import * as React from "react";
import { iconNotifications, iconAlbums, iconRedo, iconClipboard, iconAlarm } from "../components/icons/SVGData";
import { Button, Modal, Toast, Icon } from "../index";

export default class ToastDemo extends React.PureComponent<any, any>{
    state = {
        show: false,
    };
    render() {
        return (
            <React.Fragment>
                <Button type={'primary'} icon={iconClipboard} onClick={
                    e => this.setState({ show: true })
                }>Toast Demo</Button>
                <Modal show={this.state.show} onOk={
                    e => this.setState({ show: false })
                } onClose={
                    e => this.setState({ show: false })
                }>
                    <React.Fragment>
                        <Button onClick={
                            e => Toast.show({
                                content: '纯文本toast，默认3秒消失'
                            })
                        }>纯文本Toast</Button>
                        <Button type={'primary'} onClick={
                            e => Toast.info('info', 0)
                        }>info Toast</Button>
                        <Button icon={iconNotifications} onClick={
                            e => Toast.success('success!', 0)
                        }>
                            success Toast
                        </Button>
                        <Button type={'warning'} icon={iconAlbums} onClick={
                            e => Toast.error('error!', 0)
                        }>
                            error Toast
                        </Button>
                        <Button loading onClick={
                            e => Toast.loading('加载中', 0)
                        }>
                            loading Toast
                        </Button>
                        <Button onClick={
                            e => Toast.isShow() ? Toast.hide() : Toast.show()
                        }>
                            toggle Toast display
                        </Button>
                        <Button onClick={
                            e => Toast.show({
                                content: '带蒙层Toast，无法点击其他元素',
                                overlay: true
                            })
                        }>
                            带蒙层Toast
                        </Button>
                        <Button icon={<Icon icon={iconAlarm } />} onClick={
                            e => Toast.show({
                                content: 'wechat!',
                                icon: <Icon icon={iconRedo} />,
                                duration: 0,
                            })
                        }>
                            自定义Icon的Toast
                        </Button>
                        <Button onClick={
                            e => Toast.info(
                                <React.Fragment>
                                    <h1>目录</h1>
                                    <ul>
                                        <li>第一章</li>
                                        <li>第二章</li>
                                        <li>第三章</li>
                                    </ul>
                                    <h2>第一章, CSS3 transform</h2>
                                    <div> 在上面的例子里面我们用了<b>transform: scale(-1, 1)</b>做水平翻转,然后还用了translateZ(1px)做上下图层关系。理论上我们使用scale但是并没有放大或者缩小...</div>
                                    <div>transform:translateZ() 字体模糊问题 父类重返Z轴平面 -..._博客园</div>
                                </React.Fragment>
                            , 0)
                        }>内容为HTML的Toast</Button>
                        <Button onClick={
                            e => {
                                let content = (count: number) => <div>倒计时:<span>{count}</span></div>,
                                    startCount = 5,
                                    setCountDown = () => {
                                        let nextCount = startCount--;
                                        if (nextCount === 0) {
                                            Toast.hide();
                                        } else {
                                            Toast.content(content(nextCount));
                                            window.setTimeout(() => {
                                                    setCountDown();
                                            }, 1000);
                                        }
                                    };

                                Toast.show({
                                    content: content(startCount),
                                    overlay: true,
                                    duration: 0,
                                });
                                setCountDown();
                            }
                        }>倒计时Toast</Button>
                    </React.Fragment>
                </Modal>
            </React.Fragment>
        );
    }
}