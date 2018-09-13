import * as React from "react";
import { iconInfo, iconAccusoft, iconAddressCard_r } from "../components/icons/FontAwesomeMap";
import { Tools, Icon, Form, Log, Field, Pagination, Input, CheckboxItems, Button } from "../App";

interface FormTestProps {}

const tools = Tools.getInstance();
export default class FormTest extends React.PureComponent<FormTestProps, { fields: any[], form2: any, testInputValue: string }> {
    formForFieldsRef: React.RefObject<any>;
    constructor(props: FormTestProps) {
        super(props);

        this.formForFieldsRef = React.createRef();
        this.state = {
            fields: [
                {
                    label: '复选1',
                    widget: 'checkboxItems',
                    widgetProps: {
                        name: 'check1',
                        value: ['check1value'],
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
                        disabled: true,
                    }
                },
                {
                    label: '输入1',
                    widget: 'input',
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
                    widget: 'input',
                    widgetProps: {
                        name: 'input2',
                        defaultValue: 'input2 value',
                    },
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
                <Form fields={
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
                } />
            <Form ref={this.formForFieldsRef} fields={fields} onChange={e => Log.log(e)} onSubmit={e => {
                    Log.info('onSubmit', e);
                }}></Form>
                <Button onClick={e => {
                    this.formForFieldsRef.current.submit();
                }}>submit!</Button>
                <Input value={state.testInputValue} onChange={(e: any) => {
                    // setTimeout(() => {
                        console.log(e);
                        this.setState({testInputValue: e.value});
                    // }, 100);
                }} />
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