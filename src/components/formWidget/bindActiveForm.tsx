import Widget, { FormWidgetProps } from "./Widget";
import * as React from "react";
import { ActiveFormContext, ActiveFormContextType } from "./ActiveFormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";

export default function bindActiveForm<ClassType, OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & {
        forwardedRef?: React.RefObject<any>;
    };

    class BindActiveForm extends React.PureComponent<Props, any> {
        static defaultProps = UnwrappedComponent.defaultProps;
        private activeformContext: ActiveFormContextType;
        private widgetInstance: Widget<OriginProps, any> & React.Component;
        constructor(props: Props) {
            super(props);
        }
        render() {
            let { props } = this,
                { forwardedRef, onValid, onInvalid, onValidating, ...restProps } = props as any;// TODO 此处必须转换为any，不然无法使用rest语法

            return (
                <ActiveFormContext.Consumer>
                    {context => {
                        this.activeformContext = context;

                        return <UnwrappedComponent {...restProps} 
                                    ref={(component: any) => {
                                        if (!component) {
                                            return;
                                        }
                                        
                                        this.widgetInstance = component as any;
                                        if (forwardedRef)
                                            forwardedRef.current = component;
                                    }}
                                />
                    }}
                </ActiveFormContext.Consumer>
            )
        }
        componentDidMount() {
            if (this.activeformContext) {
                let { onFieldMount } = this.activeformContext;

                onFieldMount && onFieldMount(this.widgetInstance);
            }
        }
    }

    let HoistedComponent = hoistNonReactStatics(BindActiveForm, UnwrappedComponent) as React.ComponentType<Props>;

    // 通过JSX.LibraryManagedAttributes实现props和Class.defaultProps的关联
    return React.forwardRef((props: JSX.LibraryManagedAttributes<ClassType, OriginProps>, ref: React.RefObject<any>) => {
        return <HoistedComponent {...props as any} forwardedRef={ref} />;
    });
}