import Widget, { FormWidgetProps, FormWidgetChangeEvent, FormWidgetState } from "./Widget";
import Checkbox, { CheckboxProps } from "./Checkbox";
import * as React from "react";
import Tools from "../../utils/Tools";
import cm from './CheckboxItems.scss';
import wrapWidget from "./wrapWidget";
import { CSSAttrs } from "../../utils/types";
import { DataType } from "./stores/DataConvertor";

interface CheckboxItem extends CSSAttrs {
    label: string;
    value: string;
    readOnly?: boolean;
    disabled?: boolean;
}
export interface CheckboxItemsProps extends FormWidgetProps {
    items: CheckboxItem[];
    value?: Array<CheckboxItem['value']>;
}

const tools = Tools.getInstance();
class CheckboxItems extends Widget<CheckboxItemsProps, FormWidgetState> {
    readonly dataType: DataType = 'array';// TODO bug dataType未生效
    static defaultProps: CheckboxItemsProps = {
        items: [],
    }
    private checkboxs: Array<React.ReactElement<CheckboxProps>> = [];
    constructor(props: CheckboxItemsProps) {
        super(props);
    }
    render() {
        let { items, className, style, disabled } = this.props;
        
        this.checkboxs = [];
        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, className)
            }>
                {
                    items.map((item, i) => this.renderCheckboxItem({ disabled, ...item }, i))
                }
            </div>
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
    handleChange(e: FormWidgetChangeEvent) {
        let { name, onChange } = this.props,
            checkboxs = this.checkboxs,
            nextValue: any[] = [];

        checkboxs.forEach(checkbox => {
            let { id, value, checked } = checkbox.props;

            if (id === e.id) {
                if (e.checked) {
                    nextValue.push(value);
                }
            } else {
                checked && nextValue.push(value);
            }
        });

        this.setValue(nextValue).then((val) => {
            onChange && onChange({
                name: name || '',
                value: val,
            });
        });
    }
}

export default wrapWidget(CheckboxItems);