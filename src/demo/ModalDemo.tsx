import { Modal, Button } from "src";
import * as React from "react";

export default class ModalDemo extends React.PureComponent<any,any> {
    readonly state = {
        show: false,
    }
    constructor(props: any) {
        super(props);

        this.handleOk = this.handleOk.bind(this);
    }
    render() {
        let { show } = this.state;
        
        return (
            <React.Fragment>
                <Button onClick={this.handleBtnClick}>toggle a Modal</Button>
                <Modal 
                    title={'this is a Modal'} 
                    onOk={this.handleOk} 
                    onCancel={e => {
                        this.setState((prevState: any) => {
                            alert('cancel!');
                            return { show: false };
                        })
                    }} show={show}>
                    this is a Modal
                </Modal>
            </React.Fragment>
        );
    }
    handleOk(e: any) {
        alert('ok!');
        this.setState({ show: false });
    }
    handleBtnClick = (e: React.MouseEvent) => {
        this.setState({ show: !this.state.show });
    }
}