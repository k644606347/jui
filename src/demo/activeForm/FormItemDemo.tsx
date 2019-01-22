import * as React from "react";
import { ActiveForm, Input, Field, Textarea, ValidateMessage, Button, FormItem, Toast } from "../..";

export default class FormItemDemo extends React.PureComponent {
    render() {
        return <ActiveForm 
        validateOnChange={true}
        validateOnBlur={true}
        validateRules={{
            name: ['required', /\d+/, (value) => {
                return value === 'baidu';
            }],
        }} onSubmit={this.handleSubmit}>{
            (args) => {
                return (
                    <React.Fragment>
                        <h1>FormItem Demo</h1>
                        <FormItem layout="vertical" field={<Input placeholder="姓名" name="name" />}></FormItem>
                        <ValidateMessage fieldName="name" />
                        <FormItem layout="horizontal" field={<Textarea name="description" />}></FormItem>
                        <ValidateMessage fieldName="description" />
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
