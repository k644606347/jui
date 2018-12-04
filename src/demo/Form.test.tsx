import * as React from "react";
import { Tools, Icon, Form, Log, FormItem, Pagination, CheckboxItems, Button, Input, RadioItems } from "..";
import ActiveForm, { ActiveFormProps } from "../components/formWidget/ActiveForm";
import Textarea from "../components/formWidget/Textarea";
import { FormItemProps } from "src/components/FormItem";
import { iconDoneAll, iconCloudDone } from "../components/icons/SVGData";

interface FormTestProps {}

const tools = Tools.getInstance();
export default class FormTest extends React.PureComponent<FormTestProps, { fields: FormItemProps[], form2: any, testInputValue: string }> {
    formForFieldsRef: React.RefObject<ActiveForm>;
    inputRef: React.RefObject<any>;
    constructor(props: FormTestProps) {
        super(props);

        this.formForFieldsRef = React.createRef();
        this.inputRef = React.createRef();
        this.state = {
            fields: [
                {
                    label: '复选1',
                    component: 'checkboxItems',
                    componentProps: {
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
                    component: 'radioItems',
                    componentProps: {
                        name: 'radio1',
                        // value: 'radio1value',
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
                    component: 'text',
                    componentProps: {
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
                    component: 'text',
                    componentProps: {
                        name: 'input2',
                        value: 'input2 value',
                    },
                    render: (widget: any, label: any) => <React.Fragment>{label}{widget}<Icon icon={iconDoneAll} /></React.Fragment>
                },
                {
                    label: 'textarea1',
                    component: 'textarea',
                    componentProps: {
                        name: 'textarea1',
                        value: 'textarea1',
                    },
                    render: (widget: any, label) => <React.Fragment>{label}{widget}<Icon icon={iconCloudDone} /></React.Fragment>
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
                <ActiveForm initialFields={fields}
                    onSubmit={(e: any) => {
                        Log.info('onSubmit', e);
                    }}
                    onChange={(e: any) => {
                        Log.info('onChange', e);
                    }}></ActiveForm>
                <ActiveForm initialValue={{x:1, y:2}}
                    onChange={e => {
                        console.log('onChange', e);
                    }}
                    onSubmit={e => {
                        debugger;
                    }} 
                    ref={this.formForFieldsRef} 

                >{
                    ({ value, handleChange }) => {
                        return <React.Fragment>
                        <label>x: 
                            <input type="text" name="x" value={value.x} onChange={handleChange} />
                        </label>
                        <Button onClick={this.handleSetValue}>setValue</Button>
                        <Button onClick={e => {
                            this.formForFieldsRef.current!.submit();
                        }}>submit!</Button>
                        </React.Fragment>
                    }
                }</ActiveForm>
                <Textarea onChange={(e: any) => {
                    console.log(e);
                }}/>
                <CheckboxItems items={[
                    {
                        label: 'beijing label',
                        value: 'beijing'
                    }
                ]} />
                <Input value={'baiduyixia'} onChange={e => { Log.warn(e); }}/>
                <Button>block btn</Button>
                <Button inline={true}>inline btn</Button>
            </div>
        )
    }
    componentDidMount() {
        Log.log('this.inputRef=', this.inputRef);
    }
    handleSetValue = () => {
        let activeForm = this.formForFieldsRef.current!;

        activeForm.setValue({x: 3333}).then(() => {
            console.log(activeForm.getValue());
        });
        activeForm.setValue({x: 4444}).then(() => {
            console.log(activeForm.getValue());
        });
    }
}