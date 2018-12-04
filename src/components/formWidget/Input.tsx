import * as React from 'react';
import Tools from '../../utils/Tools';
import Widget, { FormWidgetProps, FormWidgetState } from './Widget';
import PureInput from '../PureInput';
import connectActiveForm from './connectActiveForm';
import { WidgetWrapper } from './WidgetWrapper';
import ValidateReportor from './ValidateReportor';
import inputCSS from './Input.scss';
import DataConvertor from './stores/DataConvertor';

const tools = Tools.getInstance();
class Input extends Widget<FormWidgetProps, FormWidgetState> {
    static widgetName = 'input';
    static defaultProps = {
        value: '',
    }
    constructor(props: FormWidgetProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props, state } = this,
            { className, style, value, ...restProps } = props,
            { validateReport } = state,
            allowedInputElProps = this.getAllowedInputElAttrs(restProps);

        return (
            <React.Fragment>
                <WidgetWrapper style={style} className={className} validateReport={validateReport}>
                    <input {...allowedInputElProps}
                        value={this.getValue()} 
                        onChange={this.handleChange}
                        style={{
                            color: ValidateReportor.getFontColor(validateReport)
                        }}
                        className={tools.classNames(inputCSS.input, className)}
                    />
                </WidgetWrapper>
                { validateReport ? <ValidateReportor {...validateReport} /> : '' }
            </React.Fragment>
        );
    }
    protected handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target,
            { onChange } = this.props;

        onChange && onChange(this.buildEvent({
            value,
        }));
    }
}
export default connectActiveForm(Input);