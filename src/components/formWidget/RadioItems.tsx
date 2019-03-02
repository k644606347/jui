import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import Tools, { tools } from "../../utils/Tools";
import Radio, { RadioProps } from "../Radio";
import radioItemsCSS from './RadioItems.scss';
import { DataType } from "./stores/DataConvertor";

let cssModules = tools.useCSS(radioItemsCSS);

interface RadioItem extends RadioProps {
    label: string;
    value: string;
}
export interface RadioItemsProps extends FormWidgetProps {
    items: RadioItem[];
    value: string | number;
    theme?: RadioProps['theme'];
}

class RadioItems extends Widget<RadioItemsProps> {
    cssObject = radioItemsCSS;
    static defaultProps = {
        items: [],
        value: '',
    }
    dataType: DataType = 'string';
    render() {
        let { name, items, value, className, style, disabled, readOnly, theme } = this.props;
        return (
            <div style={style} className={tools.classNames(cssModules.wrapper, className)}>
                {
                    items && items.map((config, i) => {
                        let radioProps = { theme, disabled, readOnly, ...config };
                        
                        return <div key={i} className={cssModules.item}>
                            <Radio {...radioProps} name={name}
                                checked={value === config.value} 
                                className={cssModules.item} 
                                onChange={this.handleChange}>
                                { radioProps.label }
                            </Radio>
                        </div>
                    })
                }
            </div>

        )
    }
    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { onChange } = this.props;

        onChange && onChange(this.buildEvent({value: e.target.value}));
    }
}

export default RadioItems;