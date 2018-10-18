import { Modal, Button } from "src";
import * as React from "react";

export default class ModalDemo extends React.PureComponent<any,any> {
    readonly state = {
        modalProps: {
            show: false,
        }
    }
    render() {

        return (
            <React.Fragment>
                <Button onClick={this.handleBtnClick}>toggle a Modal</Button>
                <Modal title={'this is a Modal'} {...this.state.modalProps} onOk={e => {
                    
                }}>
                    this is a Modal
                </Modal>
            </React.Fragment>
        );
    }
    handleBtnClick = (e: React.MouseEvent) => {
        let { modalProps } = this.state;

        modalProps = {...modalProps, show: !modalProps.show};
        this.setState({ modalProps });
    }
}