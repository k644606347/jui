import * as React from "react";
import Form from "../components/Form";
import Field from "../components/Field";
import Tools from "../utils/Tools";
import Icon from "../components/Icon";
import { iconInfo, iconAccusoft, iconAddressCard_r } from "../components/icons/FontAwesomeMap";
import Log from "../utils/Log";
import Label from "../components/Label";
import Input from "../components/formWidget/Input";
import CheckboxItems from "../components/formWidget/CheckboxItems";
import Pagination from "../components/Pagination";
import Button from "../components/Button";

interface FormTestProps {}

const tools = Tools.getInstance();
export default class FormTest extends React.PureComponent<FormTestProps, { fields: any[], form2: any }> {
    constructor(props: FormTestProps) {
        super(props);

        this.state = {
            fields: [
                {
                    name: 'check1',
                    label: '复选1',
                    widget: 'checkbox',
                    value: 'check1value',
                    className: 'cls1',
                    style: {
                        color: 'red',
                    },
                },
                {
                    name: 'radio1',
                    label: '单选1',
                    widget: 'radio',
                    value: 'radio1value',
                    disabled: true,
                },
                {
                    name: 'input1',
                    label: '输入1',
                    widget: 'input',
                    value: 'input1 value',
                },
                {
                    name: 'input2',
                    label: '输入2',
                    widget: 'input',
                    defaultValue: 'input2 value',
                    renderWidget: (widget: any) => <React.Fragment>{widget}<Icon icon={iconInfo} color="green" /></React.Fragment>
                }
            ],
            form2: {
                city: {
                    name: 'city',
                    value: 'beijing',
                },
                isBtn: {
                    label: '是按钮',
                    name: 'isBtn',
                    checked: false,
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { state } = this,
            { fields } = state;

        return (
            <div>
                <Form fields={fields} onChange={e => Log.log(e)}></Form>
                <Form onChange={
                    e => {
                        Log.log(e);

                        let { form2 } = this.state,
                            field;

                        form2 = {...form2};
                        field = form2[e.name];
                        
                        if (field) {
                            field.value = e.value;
                            if (e.checked !== undefined)
                                field.checked = e.checked;

                            this.setState({
                                form2
                            });
                        }
                    }
                }>
                <Pagination />
                    <Field label={'name: '} widget={<Input name="name"/>} renderWidget={
                        widget => <React.Fragment>
                            <Icon icon={iconInfo} />
                            {widget}
                            <Icon icon={iconAccusoft} />
                        </React.Fragment>
                    }>
                        {/* <Label>name: </Label>
                        <Input /> */}
                    </Field>
                    <Field label="title: " widget={<Input name="title" />}>
                        {/* <Label>title: </Label>  */}
                    </Field>
                    {/* <Field label="title: " widget={<Pagination />}></Field> */}
                    <Field label="请选择城市: " widget={
                        <CheckboxItems name={state.form2.city.name} value={state.form2.city.value} items={
                            [
                                {
                                    label: '北京',
                                    value: 'beijing',
                                },
                                {
                                    label: '上海',
                                    value: 'shanghai'
                                }
                            ]
                        } />
                    }></Field>
                    <Field widget='checkbox' widgetProps={state.form2.isBtn} render={(widget) => {
                        return <React.Fragment>
                            {widget}
                            <Button type="primary" icon={iconAddressCard_r}>检查</Button>
                        </React.Fragment>
                    }}></Field>
                </Form>
                {/* <Field widget='checkbox' widgetProps={state.form2.isBtn} render={(widget) => {
                        return <React.Fragment>
                            {widget}
                            <Button type="primary" icon={iconAddressCard_r}>检查</Button>
                        </React.Fragment>
                    }}></Field> */}
            </div>
        )
    }
    handleChange(e: any) {
        Log.log('onChange',e);

        let { fields } = this.state;

        fields = [...fields];

        let targetIndex = fields.findIndex(field => field.name === e.name);

        if (targetIndex !== -1) {
            let target = fields[targetIndex];
            target = {...target, checked: e.checked};
            fields[targetIndex] = target;
        }

        this.setState({ fields });
    }
}