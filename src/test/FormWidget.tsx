import * as React from "react";
import Checkbox from "../components/formWidget/Checkbox";
import Label from "../components/Label";
import Log from "../utils/Log";
import TestWidget from "../components/formWidget/TestWidget";

export function FormWidget(props: any) {
    return (<React.Fragment>
        {/* <TestWidget /> */}
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