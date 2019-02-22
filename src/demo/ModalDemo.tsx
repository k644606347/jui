import { Modal, Button, ActiveForm, Input, CheckboxItems, Checkbox, Toast, Field, FormItem } from "..";
import * as React from "react";

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

        this.handleFormChange = this.handleFormChange.bind(this);
        this.renderActiveForm = this.renderActiveForm.bind(this);
    }
    render() {
        let { show } = this.state;
        
        return (
            <React.Fragment>
                <Button onClick={this.handleBtnClick} type="primary">simple Modal demo</Button>
                <Modal 
                    title={'this is a Modal'} 
                    closeBtn={true}
                    onOk={e => {
                        this.setState({ show: false });
                        Toast.info('ok btn clicked!', 3000, { overlay: true });
                    }} 
                    onClose={e => {
                        Toast.info('close btn clicked!');
                        this.setState({ show: false});
                    }}
                    onCancel={e => {
                        this.setState((prevState: any) => {
                            Toast.info('cancel btn clicked!');
                            return { show: false };
                        })
                    }} show={show}>
                    <ActiveForm initialValue={this.state.formData}>
                        {
                            this.renderActiveForm
                        }
                    </ActiveForm>
                </Modal>
            </React.Fragment>
        );
    }
    renderActiveForm(args) {
        return <React.Fragment>
            <div style={{height: '2000px'}}></div>
            <FormItem label='Name:' field={<Input name={'name'} value={args.value.name}/>}></FormItem>
            <FormItem label='Age:' field={<Input name={'age'} value={args.value.age}/>}></FormItem>
            <FormItem label='Vip:' field={
                <Checkbox name={'vip'} checked={args.value.vip} onChange={(e) => {
                    args.handleChange(e);
                }} />
            }></FormItem>
        </React.Fragment>
    }
    handleFormChange(e) {
        let { formData } = this.state,
            { value } = e;

        console.log(e);
        formData = {
            ...formData,
            ...value,
        };
        
        this.setState({ formData });
    }
    handleBtnClick = (e: React.MouseEvent) => {
        this.setState({ show: !this.state.show });
    }
}