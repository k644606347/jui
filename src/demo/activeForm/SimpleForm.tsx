import * as React from "react";
import { ActiveForm, Input, Field, Textarea, ValidateMessage, Button, FormItem, Toast, CheckboxItems, RadioItems } from "../..";
import { Report } from "../../validate/Validator";

export default class SimpleForm extends React.PureComponent {
    render() {
        return <ActiveForm 
        action="http://www.baidu.com"
        method="post"
        // target="top"
        initialValue={{
            isStudent: '0'
        }}
        validateOnChange={true}
        validateOnBlur={true}
        validateRules={{
            name: ['required', /\d+/, (value) => {
                return /\d+\w+/.test(value);
            }],
        }} 
        onValidate={() => {
            let result: Report[] = [];

            // result.push({fieldName: 'description', isValid: false, msg: 'onValidate called!'});
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
