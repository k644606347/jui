import * as React from "react";
import { iconInfo, iconAccusoft, iconAddressCard_r } from "../components/icons/FontAwesomeMap";
import { Tools, Icon, Form, Log, FormItem, Pagination, PureInput, CheckboxItems, Button, Checkbox, Input } from "../index";
import ActiveForm, { ActiveFormProps } from "../components/formWidget/ActiveForm";
import Textarea from "../components/formWidget/Textarea";

interface FormTestProps {}

const tools = Tools.getInstance();
export default class FormTest extends React.PureComponent<FormTestProps, { fields: any[], form2: any, testInputValue: string }> {
    formForFieldsRef: React.RefObject<any>;
    inputRef: React.RefObject<any>;
    constructor(props: FormTestProps) {
        super(props);

        this.formForFieldsRef = React.createRef();
        this.inputRef = React.createRef();
        this.state = {
            fields: [
                {
                    label: '复选1',
                    widget: 'checkboxItems',
                    widgetProps: {
                        name: 'check1',
                        value: ['check1value'],
                        required: true,
                        items: [
                            {
                                label: 'check1',
                                value: 'check1value',
                            }
                        ],
                        className: 'cls1',
                        style: {
                            color: 'red',
                        },
                    }
                },
                {
                    label: '单选1',
                    widget: 'radioItems',
                    widgetProps: {
                        name: 'radio1',
                        value: 'radio1value',
                        items: [
                            {
                                label: 'radio1',
                                value: 'radio1value',
                            }
                        ],
                        rules: [
                            {
                                rule: 'required',
                                level: 'warn',
                            }
                        ],
                        disabled: false,
                    }
                },
                {
                    label: '输入1',
                    widget: 'text',
                    widgetProps: {
                        name: 'input1',
                        value: 'input1 value',
                        rules: [
                            {
                                rule: 'maxLength',
                                value: 10,
                            }
                        ]
                    }
                },
                {
                    label: '输入2',
                    widget: 'text',
                    widgetProps: {
                        name: 'input2',
                        defaultValue: 'input2 value',
                    },
                    renderWidget: (widget: any) => <React.Fragment>{widget}<Icon icon={iconInfo} color="green" /></React.Fragment>
                },
                {
                    label: 'textarea1',
                    widget: 'textarea',
                    widgetProps: {
                        name: 'textarea1',
                        defaultValue: 'textarea1',
                    },
                    renderWidget: (widget: any) => <React.Fragment>{widget}<Icon icon={iconAccusoft} /></React.Fragment>
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
            },
            testInputValue: 'testInputValue',
        };
        window['fields1'] = this.state.fields;
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { state } = this,
            { fields } = state;

        return (
            <div>
                {/* <Form fields={
                    [
                        {
                            widget: 'checkboxItems',
                            widgetProps: {
                                name: 'ci1',
                                value: ['checkbox1', 'checkbox2'],
                                items: [
                                    {
                                        name: 'checkbox1',
                                        value: 'checkbox1',
                                        label: 'checkbox 1',
                                    },
                                    {
                                        name: 'checkbox2',
                                        value: 'checkbox2',
                                        label: 'checkbox 2',
                                        disabled: true,
                                    }
                                ]
                            }
                        }
                    ]
                } onChange={
                    e => {
                        let nextFields = [],
                            { value } = e;

                        nextFields = state.fields.map(field => {
                            let nextValue = value[field.name].value;
                            if (nextValue !== field.value) {
                                return {...field, value: nextValue};
                            } else {
                                return field;
                            }
                        });
                        this.setState({ fields: nextFields });
                    }
                } /> */}
                {
                    React.createElement(ActiveForm.create(fields), {
                        ref: this.formForFieldsRef,
                        onSubmit: (e: any) => {
                            Log.info('onSubmit', e);
                        },
                        onChange: (e: any) => {
                            Log.info('onChange', e);
                        }
                    })
                }
                <Button onClick={e => {
                    this.formForFieldsRef.current.submit();
                }}>submit!</Button>
                <PureInput ref={this.inputRef} value={state.testInputValue} onChange={(e: any) => {
                    // setTimeout(() => {
                        console.log(e);
                        this.setState({testInputValue: e.value});
                    // }, 100);
                }} />
                <PureInput value=""  />
                <Textarea onChange={(e: any) => {
                    console.log(e);
                }}/>
                <Input defaultValue={'baiduyixia'} onChange={e => { Log.warn(e); }}/>
                <Button>block btn</Button>
                <Button inline={true}>inline btn</Button>
            </div>
        )
    }
    componentDidMount() {
        Log.log('this.inputRef=', this.inputRef);
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