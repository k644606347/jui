import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import Tools from "../../utils/Tools";
import Radio, { RadioChangeEvent, RadioProps } from "../Radio";
import connectActiveForm from "./connectActiveForm";
import { CSSAttrs } from "../../utils/types";
import { WidgetWrapper } from "./WidgetWrapper";
import ValidateReportor from "./ValidateReportor";
import cm from './RadioItems.scss';
interface RadioItem extends RadioProps {
    label: string;
    value: string;
}
export interface RadioItemsProps extends FormWidgetProps {
    items: RadioItem[];
    value: string | number;
    theme?: RadioProps['theme'];
}

const tools = Tools.getInstance();
class RadioItems extends Widget<RadioItemsProps, any> {
    static defaultProps = {
        ...Widget.defaultProps,
        items: [],
        value: '',
    }
    static widgetName = 'radioItems';
    render() {
        let { name, items, value, className, style, disabled, readOnly, theme } = this.props,
            { validateReport } = this.state;
        return (
            <React.Fragment>
                <WidgetWrapper style={style} className={tools.classNames(cm.wrapper, className)} validateReport={ validateReport }>
                    {
                        items && items.map((config, i) => {
                            let radioProps = { theme, disabled, readOnly, ...config };
                            
                            return <div key={i} className={cm.item}>
                                <Radio {...radioProps} name={name}
                                    checked={value === config.value} 
                                    className={cm.item} 
                                    onChange={this.handleChange}>
                                    { radioProps.label }
                                </Radio>
                            </div>
                        })
                    }
                </WidgetWrapper>
                { validateReport ? <ValidateReportor {...validateReport} /> : '' }
            </React.Fragment>

        )
    }
    handleChange(e: RadioChangeEvent) {
        let { onChange } = this.props;

        onChange && onChange(this.buildEvent({value: e.value}));
    }
}

export default connectActiveForm<typeof RadioItems, RadioItemsProps>(RadioItems);