import * as React from "react";
import { Checkbox, Radio } from "../../JUI";
import formCSS from './FormElementsDemo.scss';
import { tools } from "../../utils/Tools";

let cssModules = tools.useCSS(formCSS);
export default class FormElementsDemo extends React.PureComponent {
    state = {
        form: {
            check1: {
                type: 'checkbox',
                checked: false,
                label: '中国'
            },
            check2: {
                type: 'checkbox',
                checked: true,
                label: '中国'
            },
            r1: {
                type: 'radio',
                checked: false,
                label: '中国'
            },
            r2: {
                type: 'radio',
                checked: false,
                label: '中国'
            },
            r3: {
                type: 'radio',
                checked: false,
                label: '中国',
                theme: 'checkmark'
            },
            r4: {
                type: 'radio',
                checked: false,
                label: '中国',
                theme: 'checkmark'
            }
        }
    }
    render() {
        let { form } = this.state;

        return (
            <div className={cssModules.wrapper}>
                请选择：{
                    Object.keys(form).map(fieldName => {
                        let fieldConfig = form[fieldName];
                        let typeMap = {
                            checkbox: Checkbox,
                            radio: Radio,
                        };

                        return <span>{React.createElement(typeMap[fieldConfig.type], {
                            ...fieldConfig,
                            name: fieldName,
                            onChange: this.handleChange
                        }, fieldConfig.label)}</span>
                    })
                }
                {/* <span><Checkbox onChange={this.handleChange} checked={form.check1.checked}  name={'check1'} checked>美国</Checkbox></span>
                <span><Checkbox onChange={this.handleChange} name={'check2'}>美国</Checkbox></span>
                <span><Radio onChange={this.handleChange} checked name={'r1'}>中国</Radio></span>
                <span><Radio onChange={this.handleChange} name={'r2'}>中国</Radio></span>
                <span><Radio onChange={this.handleChange} name={'r3'} theme="checkmark">中国</Radio></span>
                <span><Radio onChange={this.handleChange} name={'r4'} theme="checkmark" checked>中国</Radio></span> */}
            </div>
        )
    }
    handleChange = (e) => {
        let form = this.state.form,
            newForm = {...form};

        newForm[e.target.name].checked = e.target.checked;

        this.setState({form: newForm});
    }
}