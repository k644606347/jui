import { Modal, Button, ActiveForm, Input, CheckboxItems, Checkbox } from "..";
import * as React from "react";
import { ActiveFormChangeEvent, ActiveFormRenderEvent } from "../components/formWidget/ActiveForm";

export default class ModalDemo extends React.PureComponent<any,any> {
    readonly state = {
        show: false,
        formData: {
            name: '123',
            age: 17,
            vip: false
        }
    }
    constructor(props: any) {
        super(props);

        this.handleOk = this.handleOk.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.renderActiveForm = this.renderActiveForm.bind(this);
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
                    <ActiveForm initialValue={this.state.formData} onChange={this.handleFormChange}>
                        {
                            this.renderActiveForm
                        }
                    </ActiveForm>
                </Modal>
            </React.Fragment>
        );
    }
    renderActiveForm(args: ActiveFormRenderEvent) {
        return <React.Fragment>
            <Input name={'name'} value={args.value.name} onChange={args.handleChange}/>
            <Input name={'age'} value={args.value.age}/>
            <Checkbox name={'vip'} checked={args.value.vip} onChange={(e) => {
                args.handleChange(e);
            }} />
        </React.Fragment>
    }
    handleFormChange(e: ActiveFormChangeEvent) {
        let { formData } = this.state,
            { value } = e;

        console.log(e);
        formData = {
            ...formData,
            ...value,
        };
        
        this.setState({ formData });
    }
    handleOk(e: any) {
        alert('ok!');
        this.setState({ show: false });
    }
    handleBtnClick = (e: React.MouseEvent) => {
        this.setState({ show: !this.state.show });
    }
}