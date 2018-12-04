import Widget, { FormWidgetProps, FormWidgetChangeEvent } from "./Widget";
import * as React from "react";
import { FormContext } from "./FormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";

export default function connectActiveForm<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & {
        forwardedRef?: React.RefObject<any>;
    };

    class WidgetWrapper extends React.PureComponent<Props, any> {
        static defaultProps = UnwrappedComponent.defaultProps;
        private formContext: any;
        private widgetInstance: Widget<OriginProps, any> & React.Component;
        constructor(props: Props) {
            super(props);

            this.handleChange = this.handleChange.bind(this);
        }
        render() {
            let { props } = this,
                { forwardedRef, onChange, ...restProps } = props as any;// TODO 此处必须转换为any，不然无法使用rest语法

            return (
                <FormContext.Consumer>
                    {context => {
                        this.formContext = context;

                        return <UnwrappedComponent {...restProps} 
                                    ref={(component: any) => {
                                        if (!component) {
                                            return;
                                        }
                                        
                                        this.widgetInstance = component as any;
                                        if (forwardedRef)
                                            forwardedRef.current = component;
                                    }}
                                    onChange={this.handleChange} 
                                />
                    }}
                </FormContext.Consumer>
            )
        }
        componentDidMount() {
            if (this.formContext) {
                let { onWidgetMount } = this.formContext;

                onWidgetMount && onWidgetMount(this.widgetInstance);
            }
        }
        handleChange(e: FormWidgetChangeEvent) {
            let { onChange } = this.props;

            onChange && onChange(e);

            if (this.formContext) {
                let { onWidgetChange } = this.formContext;

                onWidgetChange && onWidgetChange(e);
            }
        }
    }

    let HoistedComponent = hoistNonReactStatics(WidgetWrapper, UnwrappedComponent) as React.ComponentType<Props>;

    return React.forwardRef((props: OriginProps, ref: React.RefObject<any>) => 
            <HoistedComponent {...props} forwardedRef={ref} />);
}