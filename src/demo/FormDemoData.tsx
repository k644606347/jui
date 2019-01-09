import * as React from "react";
import { Icon } from "..";
import { iconDoneAll } from "../components/icons/SVGData";

export default [
    {
        name: 'check1',
        label: '复选1',
        component: 'checkboxItems',
        value: ['check1value'],
        componentProps: {
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
        // value: 'radio1value',
        componentProps: {
            items: [
                {
                    label: 'radio1',
                    value: 'radio1value',
                }
            ],
            disabled: false,
        }
    },
    {
        name: 'input1',
        label: '输入1',
        component: 'text',
        value: 'input1 value',
        componentProps: {
        }
    },
    {
        name: 'input2',
        label: '输入2',
        component: 'text',
        value: 'input2 value',
        componentProps: {
        },
        render: ({ component, label }) => <React.Fragment>{label}{component}<Icon icon={iconDoneAll} /></React.Fragment>
    },
    {
        name: 'textarea1',
        label: 'textarea1',
        component: 'textarea',
        value: 'textarea1',
        componentProps: {
        },
        render: ({ component, label }) => <React.Fragment>{label}{component}<Icon icon={iconDoneAll} /></React.Fragment>
    }
]