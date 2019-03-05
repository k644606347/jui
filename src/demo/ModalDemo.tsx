// import * as React from "react";
// import { Report } from "../validate/Validator";
// import ActiveForm from "../components/formWidget/ActiveForm";
// import Button from "../components/Button";
// import Modal from "../components/Modal";
// import { toast } from "../components/Toast";
// import FormItem from "../components/FormItem";
// import Input from "../components/formWidget/Input";
// import ValidateMessage from "../components/formWidget/ValidateMessage";
// import Checkbox from "../components/Checkbox";

// export default class ModalDemo extends React.PureComponent<any,any> {
//     readonly state = {
//         show: false,
//         formData: {
//             name: '123',
//             age: 17,
//             vip: false
//         },
//         formIsValid: true,
//     }
//     readonly formRef = React.createRef<ActiveForm>();
//     constructor(props: any) {
//         super(props);

//         this.handleFormChange = this.handleFormChange.bind(this);
//         this.renderActiveForm = this.renderActiveForm.bind(this);
//     }
//     render() {
//         let { show, formIsValid } = this.state;
        
//         return (
//             <React.Fragment>
//                 <Button onClick={this.handleBtnClick} type="primary">simple Modal demo</Button>
//                 <Modal 
//                     title={'this is a Modal'} 
//                     closeBtn={true}
//                     okBtn={<Button onClick={
//                         e => {
//                             this.formRef && this.formRef.current && this.formRef.current.submit()
//                         }
//                     } disabled={!formIsValid} clear type="primary">ok~!</Button>}
//                     onOk={e => {
//                         this.setState({ show: false });
//                         toast.info('ok btn clicked!', 3000, { overlay: true });
//                     }} 
//                     onClose={e => {
//                         toast.info('close btn clicked!');
//                         this.setState({ show: false});
//                     }}
//                     onCancel={e => {
//                         this.setState((prevState: any) => {
//                             toast.info('cancel btn clicked!');
//                             return { show: false };
//                         })
//                     }} show={show}>
//                     <ActiveForm 
//                         ref={this.formRef}
//                         onValid={e => {
//                             this.setState({ formIsValid: true });
//                         }}
//                         onInvalid={e => {
//                             this.setState({ formIsValid: false })
//                         }} 
//                         onValidate={e => {
//                             let result: Report[] = [];
//                             if (!/^http/.test(e.value.name))
//                                 result.push({ isValid: false, fieldName: 'name', msg: '必须http开头' });
//                             return result;
//                         }}
//                         onSubmit={e => {
//                             this.setState({ show: false });
//                         }}
//                         validateOnChange 
//                         initialValue={this.state.formData}>
//                         {
//                             this.renderActiveForm
//                         }
//                     </ActiveForm>
//                 </Modal>
//             </React.Fragment>
//         );
//     }
//     renderActiveForm(args) {
//         return <React.Fragment>
//             <div style={{height: '2000px'}}></div>
//             <FormItem label='Name:' field={<Input name={'name'} value={args.value.name}/>}></FormItem>
//             <ValidateMessage fieldName="name"></ValidateMessage>
//             <FormItem label='Age:' field={<Input name={'age'} value={args.value.age}/>}></FormItem>
//             <ValidateMessage fieldName="age"></ValidateMessage>
//             <FormItem label='Vip:' field={
//                 <Checkbox name={'vip'} checked={args.value.vip} onChange={(e) => {
//                     args.handleChange(e);
//                 }} />
//             }></FormItem>
//             <ValidateMessage fieldName="vip"></ValidateMessage>
//         </React.Fragment>
//     }
//     handleFormChange(e) {
//         let { formData } = this.state,
//             { value } = e;

//         console.log(e);
//         formData = {
//             ...formData,
//             ...value,
//         };
        
//         this.setState({ formData });
//     }
//     handleBtnClick = (e: React.MouseEvent) => {
//         this.setState({ show: !this.state.show });
//     }
// }