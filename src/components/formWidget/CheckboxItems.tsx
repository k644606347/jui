import FormWidget, { FormWidgetProps, FormWidgetChangeEvent } from "./FormWidget";
import Checkbox, { CheckboxProps } from "./Checkbox";
import * as React from "react";
import Tools from "../../utils/Tools";
import wrapWidget from "./wrapWidget";
import cm from './CheckboxItems.scss';

export interface CheckboxItemsProps extends FormWidgetProps {
    items: any[];
    value?: Array<string | number>;
}

const tools = Tools.getInstance();
class CheckboxItems extends FormWidget<CheckboxItemsProps, any> {
    static defaultProps: CheckboxItemsProps = {
        items: [],
    }
    private checkboxs: Array<React.ReactElement<CheckboxProps>> = [];
    render() {
        let { name, value, items, className, style } = this.props,
            renderCheckbox = (config: any, key: any) => {
                let checkboxID = tools.genID('checkbox_item_'),
                    checkboxEl = <Checkbox id={checkboxID} name={name} value={config.value}
                            checked={value && value.some((v) => v === config.value)} 
                            readOnly={config.readOnly} disabled={config.disabled} 
                            onChange={this.handleChange}>
                            {
                                config.label
                            }
                            </Checkbox>;

                this.checkboxs.push(checkboxEl);
                return <div className={cm.item} key={key}>{ checkboxEl }</div>;
            }
        
        this.checkboxs = [];
        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, className)
            }>
                {
                    items.map((config, i) => renderCheckbox(config, i))
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