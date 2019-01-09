import * as React from "react";
import { Tools, Icon, Form, Log, FormItem, Pagination, CheckboxItems, Button, Input, RadioItems, Label, Radio, ValidateMessage } from "..";
import ActiveForm from "../components/formWidget/ActiveForm";
import Textarea from "../components/formWidget/Textarea";
import { iconDoneAll, iconCloudDone } from "../components/icons/SVGData";
import Field from "../components/formWidget/Field";
import Config, { FormWidgetName } from "./config";
import { FormItemProps } from "../components/FormItem";

interface FormTestProps {}

const tools = Tools.getInstance();
interface FieldType {
    name: string;
    component: FormWidgetName | JSX.Element;
    componentProps?: {[k: string]: any};
    label?: string;
    render?: FormItemProps['children'];
}
export default class FormDemo extends React.PureComponent<FormTestProps, { fields: FieldType[], form2: any, testInputValue: string }> {
    formForFieldsRef: React.RefObject<ActiveForm>;
    fieldInputRef: React.RefObject<any>;
    constructor(props: FormTestProps) {
        super(props);

        this.formForFieldsRef = React.createRef();
        this.fieldInputRef = React.createRef();
        this.state = {
            fields: [
                {
                    name: 'check1',
                    label: '复选1',
                    component: 'checkboxItems',
                    componentProps: {
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
                    name: 'radio1',
                    label: '单选1',
                    component: 'radioItems',
                    componentProps: {
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
                    name: 'input1',
                    label: '输入1',
                    component: 'text',
                    componentProps: {
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
                    name: 'input2',
                    label: '输入2',
                    component: 'text',
                    componentProps: {
                        value: 'input2 value',
                    },
                    render: ({ component, label }) => <React.Fragment>{label}{component}<Icon icon={iconDoneAll} /></React.Fragment>
                },
                {
                    name: 'textarea1',
                    label: 'textarea1',
                    component: 'textarea',
                    componentProps: {
                        value: 'textarea1',
                    },
                    render: ({ component, label }) => <React.Fragment>{label}{component}<Icon icon={iconCloudDone} /></React.Fragment>
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
                            { type: 'required' },
                            { type: 'maxLength', value: 10 },
                        ],
                    }}
                    validateOnChange={true} 
                    onSubmit={(e: any) => {
                        Log.info('onSubmit', e);
                    }}>{
                        ({ submitting, value, handleChange }) => {
                            return <React.Fragment>
                                {
                                    fields.map((field: FieldType, i) => {
                                        let { name, component, label, componentProps = {}, render } = field,
                                            componentNode;

                                        if (tools.isString(component)) {
                                            let widgetConfig = Config[component];
                                            if (widgetConfig) {
                                                componentNode = React.createElement(widgetConfig.class as any, {
                                                    ...componentProps,
                                                    name,
                                                });
                                            } else {
                                                componentNode = <React.Fragment>{component}</React.Fragment>
                                            }
                                        } else {
                                            componentNode = component;
                                        }
                                        
                                        componentProps = Object.assign({}, componentProps, {
                                            // submitting,
                                            value: value[name],
                                            onChange: (e: any) => {
                                                handleChange(e);
                                                // handleChange(e);
                                                // handleChange(e);
                                            },
                                        });
                                        return (
                                            <React.Fragment key={i}>
                                                <FormItem label={label} component={componentNode} componentProps={componentProps}>
                                                    {render}
                                                </FormItem>
                                                <ValidateMessage popover={true} fieldName={componentProps.name} />
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </React.Fragment>
                        }
                    }</ActiveForm>
                <ActiveForm initialValue={{
                    x:1, 
                    y:2,
                    // rawInput: 'this is a rawInput',
                }}
                    // onChange={e => {
                    //     console.log('onChange', e);
                    // }}
                    onSubmit={e => {
                        console.log('onSubmit call', e);
                    }} 
                    ref={this.formForFieldsRef} 
                    onValidate={(value) => {
                        // throw new Error('dddd');
                        return true as any;
                    }}
                    // validateRules={{
                    //     field_input: 1 as any
                    // }}
                    validateRules={{
                        field_input: { type: 'required' },
                        rawInput: [
                            { type: 'maxLength', value: 10 },
                            { type: 'required' },
                            { type: 'minLength', value: 2 },
                            { type: 'callback', value: () => {
                                // throw new Error('validateRules callback');
                                // return { isValid: true, msg: '', level: 'error' };
                                return { isValid: 1 } as any;
                                // return '';
                            }}
                        ],
                    }}
                    onValid={e => {
                        console.log(e);
                    }}
                    onInvalid={e => {
                        console.log(e);
                    }}
                    onValidating={e => {
                        console.log(e);
                    }}
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
                        <Field><input name="rawInput" /></Field>
                        <ValidateMessage fieldName={"rawInput"}></ValidateMessage>
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
                <form onSubmit={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }} action="form_action.asp" method="get">
                    <p>First name: <input type="text" name="fname" /></p>
                    <p>Last name: <input type="text" name="lname" /></p>
                    <input type="submit" value="Submit" />
                </form>
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