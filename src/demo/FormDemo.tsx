import * as React from "react";
import { Tools, Icon, Form, Log, FormItem, Pagination, CheckboxItems, Button, Input, RadioItems, Label, Radio, ValidateMessage } from "..";
import ActiveForm, { ActiveFormProps } from "../components/formWidget/ActiveForm";
import Textarea from "../components/formWidget/Textarea";
import { FormItemProps } from "src/components/FormItem";
import { iconDoneAll, iconCloudDone } from "../components/icons/SVGData";
import Field from "../components/formWidget/Field";

interface FormTestProps {}

const tools = Tools.getInstance();
export default class FormDemo extends React.PureComponent<FormTestProps, { fields: FormItemProps[], form2: any, testInputValue: string }> {
    formForFieldsRef: React.RefObject<ActiveForm>;
    fieldInputRef: React.RefObject<any>;
    constructor(props: FormTestProps) {
        super(props);

        this.formForFieldsRef = React.createRef();
        this.fieldInputRef = React.createRef();
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
                        ],
                        onValidating(e: any) {
                            console.log('validating', e);
                        },
                        onInvalid(e: any) {
                            console.error('invalid', e);
                        },
                        onValid(e: any) {
                            console.info('valid', e);
                        }
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
                <ActiveForm 
                    validateRules={{
                        input1: [
                            { rule: 'required' },
                            { rule: 'maxLength', value: 10 },
                        ],
                    }}
                    validateOnChange={true} 
                    onSubmit={(e: any) => {
                        Log.info('onSubmit', e);
                    }}>{
                        ({ submitting, value, handleChange }) => {
                            return <React.Fragment>
                                {
                                    fields.map((field: FormItemProps, i) => {
                                        let { component, label, componentProps = {}, render} = field;
                                        
                                        componentProps = Object.assign({}, componentProps, {
                                            // submitting,
                                            value: value[componentProps.name],
                                            onChange: (e: any) => {
                                                handleChange(e);
                                                // handleChange(e);
                                                // handleChange(e);
                                            },
                                        });
                                        return (
                                            <React.Fragment key={i}>
                                                <FormItem label={label} component={component} componentProps={componentProps} render={render}></FormItem>
                                                <ValidateMessage popover={true} fieldName={componentProps.name} />
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </React.Fragment>
                        }
                    }</ActiveForm>
                <ActiveForm initialValue={{x:1, y:2}}
                    // onChange={e => {
                    //     console.log('onChange', e);
                    // }}
                    onSubmit={e => {
                        debugger;
                    }} 
                    ref={this.formForFieldsRef} 
                    onValidate={(value) => {
                        return true as any;
                    }}
                    // validateRules={{
                    //     field_input: 1 as any
                    // }}
                    validateOnChange={true}
                >{
                    ({ value, handleChange }) => {
                        return <React.Fragment>
                        <Label>x: 
                            <input type="text" name="x" value={value.x} onChange={handleChange} />
                        </Label>
                        <br/>
                        <Label>
                            radio items1:
                            <Field>
                                <RadioItems items={[
                                    {
                                        label: '北京',
                                        value: 'beijing'
                                    },
                                    {
                                        label: '上海',
                                        value: 'shanghai',
                                    },
                                    {
                                        label: '百度',
                                        value: 'baidu',
                                    }
                                ]} name="radioItems1" value={value.radioItems1}></RadioItems>
                            </Field>
                        </Label>
                        <Label>field input:</Label>
                        <Field><Input ref={this.fieldInputRef} name="field_input"/></Field>
                        <ValidateMessage fieldName={'field_input'} />
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
                <CheckboxItems theme="square" items={[
                    {
                        label: 'shanghai label',
                        value: 'shanghai'
                    }
                ]} />
                <Label>testInput</Label><Input onChange={e => { Log.warn(e); }}/>
                <Button>block btn</Button>
                <Button inline={true}>inline btn</Button>
            </div>
        )
    }
    componentDidMount() {
        Log.log('FormDemo.fieldInputRef=', this.fieldInputRef);
    }
    handleSetValue = () => {
        let activeForm = this.formForFieldsRef.current!;

        // 在Promise/setTimeout/原生dom事件中的setState和rerender是同步的
        Promise.resolve().then(() => {
            activeForm.setValue({x: 222}, () => {
                console.log('setValue callback', activeForm.getValue());
            });
            activeForm.setValue({x: 2222}, {
                success() {
                    console.log('setValue options.succes', activeForm.getValue());
                }
            });
        });

        // react的合成事件/钩子函数中的setState会批量更新，不会立即rerender，需要在回调中获得新的state
        activeForm.setValue({x: 3333}, () => {
            console.log(activeForm.getValue());
        });
        // console.log(activeForm.getValue()); // 因为setValue不一定会立即更新，所以应该在回调中使用getValue();
        activeForm.setValue({x: 4444}, () => {
            console.log(activeForm.getValue());
        });
    }
}