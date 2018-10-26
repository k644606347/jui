import { Toast, Button } from "src";
import * as React from "react";
import { iconCheckCircle_r, iconTimesCircle_r } from "src/components/icons/FontAwesomeMap";

export default class ToastDemo extends React.PureComponent<any, any>{
    render() {
        return (
            <React.Fragment>
                <Button type={'primary'} onClick={
                    e => Toast.info('info', 0)
                }>info Toast</Button>
                <Button icon={iconCheckCircle_r} onClick={
                    e => Toast.success('success!', 0)
                }>
                    success Toast
                </Button>
                <Button type={'warning'} icon={iconTimesCircle_r} onClick={
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
            </React.Fragment>
        );
    }
    componentDidMount() {
        Toast.info('dfdf', 0);
        Toast.info('dfd33f', 0);
    }
}