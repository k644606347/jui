import FormWidget, { FormWidgetProps, FormWidgetChangeEvent } from "./FormWidget";
import * as React from "react";
import Tools from "../../utils/Tools";
import wrapWidget from "./wrapWidget";
import cm from './CheckboxItems.scss';
import Radio, { RadioProps } from "./Radio";

export interface RadioItemsProps extends FormWidgetProps {
    items: any[];
    value?: string | number;
    layout?: 'horizontal' | 'vertical';
}

const tools = Tools.getInstance();
class RadioItems extends FormWidget<RadioItemsProps, any> {
    static defaultProps: RadioItemsProps = {
        items: [],
        layout: 'horizontal',
    }
    render() {
        let { name, value, items, className, style, layout } = this.props;

        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, layout && cm[layout], className)
            }>
                {
                    items.map((config, i) =>
                        <div key={i} className={cm.item}>
                            <Radio name={name} value={config.value} 
                                checked={value === config.value} 
                                readOnly={config.readOnly} disabled={config.disabled} 
                                className={cm.item} 
                                onChange={this.handleChange}>
                                { config.label }
                            </Radio>
                        </div>
                    )
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
        let { name, onChange } = this.props;

        onChange && onChange({
            name: name || '',
            value: e.value,
        });
    }
}

export default wrapWidget(RadioItems);