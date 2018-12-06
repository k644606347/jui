import Widget, { FormWidgetProps, FormWidgetChangeEvent, FormWidgetState } from "./Widget";
import Checkbox, { CheckboxProps, CheckboxChangeEvent } from "../Checkbox";
import * as React from "react";
import Tools from "../../utils/Tools";
import connectActiveForm from "./connectActiveForm";
import { CSSAttrs } from "../../utils/types";
import { DataType } from "./stores/DataConvertor";
import { WidgetWrapper } from "./WidgetWrapper";
import ValidateReportor from "./ValidateReportor";
import cm from './CheckboxItems.scss';

interface CheckboxItem extends CSSAttrs {
    label: string;
    value: string;
    readOnly?: boolean;
    disabled?: boolean;
}
export interface CheckboxItemsProps extends FormWidgetProps {
    items: CheckboxItem[];
    value: Array<CheckboxItem['value']>;
}

const tools = Tools.getInstance();
class CheckboxItems extends Widget<CheckboxItemsProps, FormWidgetState> {
    static defaultProps = {
        ...Widget.defaultProps,
        items: [],
        value: [],
    }
    static widgetName = 'checkboxItems';
    static dataType: DataType = 'array';
    private checkboxs: Array<React.ReactElement<CheckboxProps>> = [];
    constructor(props: CheckboxItemsProps) {
        super(props);
    }
    render() {
        let { items, className, style, disabled } = this.props,
            { validateReport } = this.state;
        
        this.checkboxs = [];

        return (
            <React.Fragment>
                <WidgetWrapper style={style} className={tools.classNames(cm.wrapper, className)} validateReport={ validateReport }>
                    {
                        items.map((item, i) => this.renderCheckboxItem({ disabled, ...item }, i))
                    }
                </WidgetWrapper>
                { validateReport ? <ValidateReportor {...validateReport} /> : '' }
            </React.Fragment>

        )
    }
    private renderCheckboxItem(item: CheckboxItem, key: string | number) {
        let { name } = this.props,
            value = this.getValue(),
            checkboxID = tools.genID('checkbox_item_'),
            checkboxEl = <Checkbox id={checkboxID} name={name} value={item.value}
                    checked={
                        tools.isArray(value) ? value.some((v) => v === item.value) : false
                    } 
                    readOnly={item.readOnly} disabled={item.disabled} 
                    onChange={this.handleChange}>
                    {
                        item.label
                    }
                    </Checkbox>;
                    
        this.checkboxs.push(checkboxEl);
        return <div className={cm.item} key={key}>{ checkboxEl }</div>;
    }
    handleChange(e: CheckboxChangeEvent) {
        let { onChange } = this.props,
            checkboxs = this.checkboxs,
            nextValue: Array<CheckboxItem['value']> = [];
            
        checkboxs.forEach(checkbox => {
            let { id, value = '', checked } = checkbox.props;

            value = String(value);
            if (id === e.id) {
                if (e.checked) {
                    nextValue.push(value);
                }
            } else {
                checked && nextValue.push(value);
            }
        });

        onChange && onChange(this.buildEvent({ value: nextValue }));
    }
}

export default connectActiveForm<typeof CheckboxItems, CheckboxItemsProps>(CheckboxItems);