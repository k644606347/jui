import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import Tools from "../../utils/Tools";
import cm from './RadioItems.scss';
import Radio from "../Radio";
import connectActiveForm from "./connectActiveForm";
import { CSSAttrs } from "../../utils/types";
import { WidgetWrapper } from "./WidgetWrapper";
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
        let { name, items, className, style, disabled, readOnly } = this.props,
            { validateReport } = this.state,
            value = this.getValue();

        return (
            <WidgetWrapper style={style} className={tools.classNames(cm.wrapper, className)} validateReport={ validateReport }>
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
            </WidgetWrapper>
        )
    }
    handleChange(e: FormWidgetChangeEvent) {
        let { onChange } = this.props;

        this.setValue(e.value).then(val => {
            this.dispatchEvent(onChange, { value: val });
        })
    }
}

export default connectActiveForm(RadioItems);