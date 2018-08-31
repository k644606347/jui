import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import Checkbox, { CheckboxProps } from "./Checkbox";
import * as React from "react";
import Tools from "../../utils/Tools";
import cm from './CheckboxItems.scss';
import wrapWidget from "./wrapWidget";

interface CheckboxItem {
    value: string;
    label: string;
    checked?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
}
export interface CheckboxItemsProps extends FormWidgetProps {
    items: CheckboxItem[];
    value?: CheckboxItem['value'] | Array<CheckboxItem['value']>;
}

const tools = Tools.getInstance();
class CheckboxItems extends Widget<CheckboxItemsProps, any> {
    static defaultProps: CheckboxItemsProps = {
        items: [],
    }
    private checkboxs: Array<React.ReactElement<CheckboxProps>> = [];
    render() {
        let { name, value, items, className, style } = this.props;
        
        this.checkboxs = [];
        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, className)
            }>
                {
                    items.map((item, i) => this.renderCheckboxItem(item, i))
                }
            </div>
        )
    }
    focus() {
        //
    }
    blur() {
        //
    }
    private renderCheckboxItem(item: CheckboxItem, key: string | number) {
        let { value } = this.props,
            checkboxID = tools.genID('checkbox_item_'),
            checkboxEl = <Checkbox id={checkboxID} name={name} value={item.value}
                    checked={
                        Array.isArray(value) ? 
                            value.some((v) => v === item.value) : value === item.value
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
    handleChange(e: FormWidgetChangeEvent) {
        let { name, onChange } = this.props,
            checkboxs = this.checkboxs,
            resultValue: any[] = [];

        checkboxs.forEach(checkbox => {
            let { id, value, checked } = checkbox.props;

            if (id === e.id) {
                if (e.checked) {
                    resultValue.push(value);
                }
            } else {
                checked && resultValue.push(value);
            }
        });

        onChange && onChange({
            name: name || '',
            value: resultValue,
        });
    }
}

export default wrapWidget(CheckboxItems);