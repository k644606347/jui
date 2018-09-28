import Widget, { FormWidgetProps } from "./Widget";
import * as React from "react";
import Tools from "../../utils/Tools";
import { FormContext } from "./FormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";
const tools = Tools.getInstance();

interface ExtraProps {
    forwardedRef?: React.RefObject<any>;
}

export default function connectActiveForm<OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & ExtraProps;

    class WidgetWrapper extends React.PureComponent<Props, any> {
        static defaultProps: Partial<Props> = {
            ...UnwrappedComponent.defaultProps as any
        }
        private formContext: any;
        private widgetInstance: Widget<OriginProps, any> & React.Component;
        constructor(props: Props) {
            super(props);
        }
        render() {
            let { props } = this,
                { forwardedRef, ...restProps } = props as any;// TODO 此处必须转换为any，不然无法使用rest语法

            return (
                <FormContext.Consumer>
                    {context => {
                        this.formContext = context;

                        return <UnwrappedComponent {...restProps} 
                                    ref={(component) => {
                                        if (!component) {
                                            return;
                                        }
                                        
                                        this.widgetInstance = component as any;
                                        if (forwardedRef)
                                            forwardedRef.current = component;
                                    }}
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
    }

    let HoistedComponent = hoistNonReactStatics(WidgetWrapper, UnwrappedComponent) as React.ComponentClass<Props>;

    return React.forwardRef((props: Props, ref: React.RefObject<any>) => 
            <HoistedComponent {...props} forwardedRef={ref} />);
}