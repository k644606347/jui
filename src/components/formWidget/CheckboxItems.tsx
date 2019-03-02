import Widget, { FormWidgetProps } from "./Widget";
import Checkbox, { CheckboxProps } from "../Checkbox";
import * as React from "react";
import { CSSAttrs } from "../../utils/types";
import { DataType } from "./stores/DataConvertor";
import checkboxItemsCSS from './CheckboxItems.scss';
import { tools } from "../../utils/Tools";

let cssModules = tools.useCSS(checkboxItemsCSS);
interface CheckboxItem extends CSSAttrs {
    label: string;
    value: string;
    readOnly?: boolean;
    disabled?: boolean;
}
export interface CheckboxItemsProps extends FormWidgetProps {
    items: CheckboxItem[];
    value: Array<CheckboxItem['value']>;
    theme?: CheckboxProps['theme'];
}
class CheckboxItems extends Widget<CheckboxItemsProps> {
    cssObject = checkboxItemsCSS;
    static defaultProps = {
        items: [],
        value: [],
    }
    dataType: DataType = 'array';
    private checkboxs: Array<React.ReactElement<CheckboxProps>> = [];
    constructor(props: CheckboxItemsProps) {
        super(props);
    }
    render() {
        let { items, className, style, disabled } = this.props;
        
        this.checkboxs = [];
        return (
            <div style={style} className={tools.classNames(cssModules.wrapper, className)}>
                {
                    items.map((item, i) => this.renderCheckboxItem({ disabled, ...item }, i))
                }
            </div>

        )
    }
    private renderCheckboxItem(item: CheckboxItem, key: string | number) {
        let { name } = this.props,
            value = this.getParsedValue(),
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
        return <div className={cssModules.item} key={key}>{ checkboxEl }</div>;
    }
    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { target } = e,
            { onChange } = this.props,
            checkboxs = this.checkboxs,
            nextValue: Array<CheckboxItem['value']> = [];
            
        checkboxs.forEach(checkbox => {
            let { id, value = '', checked } = checkbox.props;

            value = String(value);
            if (id === target.id) {
                if (target.checked) {
                    nextValue.push(value);
                }
            } else {
                checked && nextValue.push(value);
            }
        });

        onChange && onChange(this.buildEvent({ value: nextValue }));
    }
}
export default CheckboxItems;