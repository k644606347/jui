import * as React from "react";
import { Report } from "../../validate/Validator";
import ActiveForm from "../../components/formWidget/ActiveForm";
import FormItem from "../../components/FormItem";
import Input from "../../components/formWidget/Input";
import ValidateMessage from "../../components/formWidget/ValidateMessage";
import Textarea from "../../components/formWidget/Textarea";
import RadioItems from "../../components/formWidget/RadioItems";
import Button from "../../components/Button";
import Toast from "../../components/Toast";

export default class SimpleForm extends React.PureComponent {
    render() {
        return <ActiveForm 
        action="http://cms.pub.sina.com.cn"
        method="post"
        // target="top"
        initialValue={{
            isStudent: '0'
        }}
        validateOnChange={true}
        // validateOnBlur={true}
        validateRules={{
            name: ['required', /\d+/, (value) => {
                return /\d+\w+/.test(value);
            }],
        }} 
        onValidate={e => {
            let result: Report[] = [];

            if (!/^cms/.test(e.value.description)) {
                result.push({fieldName: 'description', isValid: false, msg: '必须以cms开头'});
            }
            return result;
        }}
        onSubmit={this.handleSubmit}>{
            (args) => {
                return (
                    <React.Fragment>
                        <FormItem floatingLabel={true} label="姓名" layout="vertical" field={
                            <Input autoFocus={true} name="name" />
                        }></FormItem>
                        <ValidateMessage fieldName="name" />
                        <FormItem floatingLabel={true} label="描述" layout="vertical" field={
                            <Textarea name="description" />
                        }></FormItem>
                        <ValidateMessage fieldName="description" />
                        <FormItem label="是否学生" layout="vertical" field={
                            <RadioItems name="isStudent" items={[
                                { label: '是', value: '1' },
                                { label: '否', value: '0' }
                            ]}></RadioItems>
                        }></FormItem>
                        <h2>子ActiveForm， 父子互不影响</h2>
                        <ActiveForm initialValue={{
                            name: 'this is a title',
                        }}>{() => {
                            return <FormItem field={<Input name='name' />}></FormItem>
                        }}</ActiveForm>
                        <ValidateMessage fieldName="isStudent" />
                        <Button type="primary" disabled={!args.isValid} onClick={args.handleSubmit}>submit!</Button>
                        <Button disabled={!args.isValid} onClick={args.handleReset}>reset!</Button>
                    </React.Fragment>
                )
            }
        }</ActiveForm>
    }
    handleSubmit = (e) => {
        e.preventDefault();
        Toast.info('submit data' + JSON.stringify(e.value));
    }
}
