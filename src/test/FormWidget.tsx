import * as React from "react";
import Checkbox from "../components/formWidget/Checkbox";
import Label from "../components/Label";
import Log from "../utils/Log";
import TestWidget from "../components/formWidget/TestWidget";
import CheckboxItems from "../components/formWidget/CheckboxItems";
import RadioItems from "../components/formWidget/RadioItems";

export class FormWidget extends React.PureComponent<any, any> {
    readonly state: any = {
        checkboxItems: {
            items: [
                {
                    value: 'sh',
                    label: '上海',
                },
                {
                    value: 'bj',
                    label: '北京',
                },
                {
                    value: 'gz',
                    label: '广州',
                }
            ],
            value: [
                'bj',
                'gz',
            ]
        },
        radioItems: {
            items: [
                {
                    value: 'w',
                    label: '宽度',
                },
                {
                    value: 'h',
                    label: '高度',
                },
                {
                    value: 'both',
                    label: '宽+高',
                },
                {
                    value: 'readOnly',
                    label: '只读的',
                    readOnly: true,
                },
                {
                    value: 'disabled',
                    label: '禁用的',
                    disabled: true,
                }
            ],
            value: 'w',
        }
    };
    render() {
        let { state } = this;

        return (<React.Fragment>
            {/* <TestWidget /> */}
            <Label>
                多选项: 
                <CheckboxItems items={state.checkboxItems.items} value={state.checkboxItems.value} onChange={
                    (e: any) => {
                        let checkboxItems = {...state.checkboxItems};
                        checkboxItems.value = e.value;
                        this.setState({ checkboxItems });
                    }
                } />
            </Label>
            <Label>
                单选项: 
                <RadioItems {...state.radioItems} onChange={
                    (e: any) => {
                        let { radioItems } = state;

                        radioItems = {...radioItems};
                        radioItems.value = e.value;

                        this.setState({ radioItems });
                    }
                }/>
            </Label>
            <Label>Check1</Label><Checkbox name="check1" required onChange={
                e => Log.info(e)
            } 
            onValid={(e) => {
                Log.log(e);
            }} 
            onInvalid={e => {
                Log.error(e);
            }}
            value={'check1'} rules={
                [
                    {
                        rule: 'callback',
                        value: (value: any) => {
                            console.log('callback1');
                            return value === 'check1';
                        }
                    },
                    {
                        rule: 'callback',
                        // value: '1',
                        value(value: any) {
                            return new Promise((resolve, reject) => {
                                console.log('callback2');
                                resolve({
                                    msg: 'callback2 resolved',
                                    isValid: true,
                                });
                            })
                        },
                        level: 'warn'
                    }, 
                    // {
                    //     rule: 'callback',
                    //     value(value: any) {
                    //         return new Promise((resolve, reject) => {
                    //             console.log('callback3');
        
                    //             throw new Error('this is a Error');
                    //         })
                    //     }
                    // },
                    // {
                    //     rule: 'callback',
                    //     value(value: any) {
                    //         return new Promise((resolve, reject) => {
                    //             console.log('callback4');
        
                    //             reject({
                    //                 msg: `callback3 error ${value}`,
                    //                 isValid: false,
                    //             });
                    //         })
                    //     }
                    // },
                    {
                        rule: 'callback',
                        // tslint:disable-next-line:no-string-literal
                        value: window && window['testCallback']
                    }
                ]
            }/>
        </React.Fragment>)
    }
}