import { Modal, Button, ActiveForm, Input } from "..";
import * as React from "react";

export default class ModalDemo extends React.PureComponent<any,any> {
    readonly state = {
        show: false,
        formData: {
            name: '123',
            age: 17,
        }
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
                    <ActiveForm onChange={e => {
                        let { formData } = this.state,
                            { fieldName, fieldValue } = e;

                        console.log(e);
                        formData = {
                            ...formData, 
                            [fieldName]: fieldValue
                        };
                        
                        this.setState({ formData });
                    }}>
                        {
                            (args) => {
                                console.log('children method called!');
                                return <React.Fragment>
                                    <Input name={'name'} value={this.state.formData.name}/>
                                    <Input name={'age'} value={this.state.formData.age}/>
                                </React.Fragment>
                            }
                        }
                    </ActiveForm>
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