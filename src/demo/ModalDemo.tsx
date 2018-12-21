import { Modal, Button, ActiveForm, Input, CheckboxItems, Checkbox, Toast } from "..";
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
                    closeBtn={true}
                    onOk={e => {
                        Toast.info('ok btn clicked!');
                        this.setState({ show: false });
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
    handleBtnClick = (e: React.MouseEvent) => {
        this.setState({ show: !this.state.show });
    }
}