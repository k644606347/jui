import * as React from "react";
import { ActiveForm, Input, Field, Textarea, ValidateMessage, Button, FormItem, Toast, CheckboxItems, RadioItems } from "../..";

export default class SimpleForm extends React.PureComponent {
    render() {
        return <ActiveForm 
        validateOnChange={true}
        validateOnBlur={true}
        validateRules={{
            name: ['required', /\d+/, (value) => {
                return /\d+\w+/.test(value);
            }],
        }} onSubmit={this.handleSubmit}>{
            (args) => {
                return (
                    <React.Fragment>
                        <FormItem label="姓名" field={<Input name="name" />}></FormItem>
                        <ValidateMessage fieldName="name" />
                        <FormItem label="描述" field={<Textarea name="description" />}></FormItem>
                        <ValidateMessage fieldName="description" />
                        <FormItem label="是否学生" field={<RadioItems name="isStudent" items={[
                            { label: '是', value: '1' },
                            { label: '否', value: '0' }
                        ]}></RadioItems>}></FormItem>
                        <ValidateMessage fieldName="isStudent" />
                        <Button onClick={args.handleSubmit}>submit!</Button>
                        <Button onClick={args.handleReset}>reset!</Button>
                    </React.Fragment>
                )
            }
        }</ActiveForm>
    }
    handleSubmit = (e) => {
        console.log(e.value);
        Toast.info('submit data' + JSON.stringify(e.value));
    }
}
