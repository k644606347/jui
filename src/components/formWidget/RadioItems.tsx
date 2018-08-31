import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import Tools from "../../utils/Tools";
import cm from './RadioItems.scss';
import Radio from "./Radio";
import wrapWidget from "./wrapWidget";

export interface RadioItemsProps extends FormWidgetProps {
    items: any[];
    value?: string | number;
}

const tools = Tools.getInstance();
class RadioItems extends Widget<RadioItemsProps, any> {
    static defaultProps: RadioItemsProps = {
        items: [],
    }
    render() {
        let { name, value, items, className, style } = this.props;

        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, className)
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