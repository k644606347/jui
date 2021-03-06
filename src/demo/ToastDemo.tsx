
import * as React from "react";
import { iconNotifications, iconAlbums, iconRedo, iconClipboard, iconAlarm } from "../components/icons/SVGData";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import Icon from "../components/Icon";

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
                } onCancel={
                    e => this.setState({ show: false })
                }>
                    <React.Fragment>
                        <Button full onClick={
                            e => toast.show({
                                content: '纯文本toast，默认3秒消失'
                            })
                        }>纯文本Toast</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是顶部toast',
                                position: 'top',
                                duration: 5000
                            })
                        }>顶部Toast</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是底部toast',
                                position: 'bottom',
                                duration: 5000,
                                onClose: () => {
                                    console.log('Toast onClose event!');
                                }
                            })
                        }>底部Toast</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是bottom toast',
                                position: 'bottom',
                                duration: 5000,
                                onClose: () => {
                                    console.log('Toast onClose event!');
                                },
                                animate: false,
                            })
                        }>底部Toast(无动画效果)</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是middle toast',
                                position: 'middle',
                                duration: 5000,
                                onClose: () => {
                                    console.log('Toast onClose event!');
                                },
                                animate: false,
                            })
                        }>中部Toast(无动画效果)</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是top toast',
                                position: 'top',
                                duration: 5000,
                                onClose: () => {
                                    console.log('Toast onClose event!');
                                },
                                animate: false,
                            })
                        }>无动画效果3</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是top toast',
                                position: 'top',
                                duration: 5000,
                                onClose: () => {
                                    console.log('Toast onClose event!');
                                },
                                animate: false,
                                overlay: true
                            })
                        }>顶部Toast(无动画效果)</Button>
                        <Button full onClick={
                            e => toast.loading('', 0)
                        }>只有图标</Button>
                        <Button full type={'primary'} onClick={
                            e => toast.info('info', 0)
                        }>info Toast</Button>
                        <Button full icon={iconNotifications} onClick={
                            e => toast.success('success!', 0)
                        }>
                            success Toast
                        </Button>
                        <Button full loading onClick={
                            e => toast.loading('加载中', 0)
                        }>
                            loading Toast
                        </Button>
                        <Button full onClick={
                            e => toast.isShow() ? toast.hide() : toast.show()
                        }>
                            toggle Toast display
                        </Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '带蒙层Toast，无法点击其他元素',
                                overlay: true
                            })
                        }>
                            带蒙层Toast
                        </Button>
                        <Button full icon={<Icon icon={iconAlarm } />} onClick={
                            e => toast.show({
                                content: 'wechat!',
                                icon: <Icon icon={iconRedo} />,
                                duration: 0,
                            })
                        }>
                            自定义Icon的Toast
                        </Button>
                        <Button full onClick={
                            e => toast.info(
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
                        <Button full onClick={
                            e => {
                                let content = (count: number) => <div>倒计时:<span>{count}</span></div>,
                                    startCount = 5,
                                    setCountDown = () => {
                                        let nextCount = startCount--;
                                        if (nextCount === 0) {
                                            toast.hide();
                                        } else {
                                            toast.content(content(nextCount));
                                            window.setTimeout(() => {
                                                    setCountDown();
                                            }, 1000);
                                        }
                                    };

                                toast.show({
                                    content: content(startCount),
                                    overlay: true,
                                    duration: 0,
                                });
                                setCountDown();
                            }
                        }>倒计时Toast</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是顶部toast',
                                position: 'top',
                                duration: 0,
                                theme: 'light'
                            })
                        }>theme: 'light'</Button>
                        <Button full onClick={
                            e => toast.show({
                                content: '这是顶部toast',
                                position: 'bottom',
                                // duration: 0,
                                theme: 'light',
                                overlay: true
                            })
                        }>theme: 'light',overlay: true</Button>
                    </React.Fragment>
                </Modal>
            </React.Fragment>
        );
    }
}