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
                <Button icon={'loading'} onClick={
                    e => Toast.loading('加载中', 0)
                }>
                    loading Toast
                </Button>
                <Button onClick={
                    e => Toast.isShow() ? Toast.hide() : Toast.show()
                }>
                    toggle Toast display
                </Button>
            </React.Fragment>
        );
    }
    componentDidMount() {
        Toast.info('dfdf', 0);
        Toast.info('dfd33f', 0);
    }
}