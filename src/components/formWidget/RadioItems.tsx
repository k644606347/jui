import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import Tools from "../../utils/Tools";
import cm from './RadioItems.scss';
import Radio from "./Radio";
import wrapWidget from "./wrapWidget";
import { CSSAttrs } from "../../utils/types";
interface RadioItems extends CSSAttrs {
    label: string;
    value: string;
    readOnly?: boolean;
    disabled?: boolean;
}
export interface RadioItemsProps extends FormWidgetProps {
    items: RadioItems[];
    value?: string | number;
}

const tools = Tools.getInstance();
class RadioItems extends Widget<RadioItemsProps, any> {
    static defaultProps: RadioItemsProps = {
        items: [],
    }
    render() {
        let { name, value, items, className, style, disabled, readOnly } = this.props;

        return (
            <div style={style} className={
                tools.classNames(cm.wrapper, className)
            }>
                {
                    items.map((config, i) => {
                        let mixedConfig = { disabled, readOnly, ...config };
                        
                        return <div key={i} className={cm.item}>
                            <Radio {...mixedConfig} name={name}
                                checked={value === config.value} 
                                className={cm.item} 
                                onChange={this.handleChange}>
                                { mixedConfig.label }
                            </Radio>
                        </div>
                    })
                }
            </div>
        )
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