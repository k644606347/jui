import Widget, { FormWidgetProps, FormWidgetChangeEvent, FormWidgetValidEvent } from "./Widget";
import * as React from "react";
import { ActiveFormContext, ActiveFormContextType } from "./ActiveFormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";

export default function bindActiveForm<ClassType, OriginProps extends FormWidgetProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & {
        forwardedRef?: React.RefObject<any>;
    };

    class WidgetWrapper extends React.PureComponent<Props, any> {
        static defaultProps = UnwrappedComponent.defaultProps;
        private activeformContext: ActiveFormContextType;;
        private widgetInstance: Widget<OriginProps, any> & React.Component;
        constructor(props: Props) {
            super(props);

            this.handleChange = this.handleChange.bind(this);
            this.handleValid = this.handleValid.bind(this);
            this.handleInvalid = this.handleInvalid.bind(this);
            this.handleValidating = this.handleValidating.bind(this);
        }
        render() {
            let { props } = this,
                { forwardedRef, onChange, onValid, onInvalid, onValidating, ...restProps } = props as any;// TODO 此处必须转换为any，不然无法使用rest语法

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
                                    onChange={this.handleChange} 
                                    onValid={this.handleValid} 
                                    onInvalid={this.handleInvalid}
                                    onValidating={this.handleValidating}
                                />
                    }}
                </ActiveFormContext.Consumer>
            )
        }
        componentDidMount() {
            if (this.activeformContext) {
                let { onWidgetMount } = this.activeformContext;

                onWidgetMount && onWidgetMount(this.widgetInstance);
            }
        }
        handleChange(e: FormWidgetChangeEvent) {
            let { onChange } = this.props;

            onChange && onChange(e);

            if (this.activeformContext) {
                let { onWidgetChange } = this.activeformContext;

                onWidgetChange && onWidgetChange(e);
            }
        }
        handleValidating(e: FormWidgetValidEvent) {
            let { onValidating } = this.props;

            onValidating && onValidating(e);

            if (this.activeformContext) {
                let { onWidgetValidating } = this.activeformContext;

                onWidgetValidating && onWidgetValidating(e);
            }
        }
        handleValid(e: FormWidgetValidEvent) {
            let { onValid } = this.props;

            onValid && onValid(e);

            if (this.activeformContext) {
                let { onWidgetValid } = this.activeformContext;

                onWidgetValid && onWidgetValid(e);
            }
        }
        handleInvalid(e: FormWidgetValidEvent) {
            let { onInvalid } = this.props;

            onInvalid && onInvalid(e);

            if (this.activeformContext) {
                let { onWidgetInvalid } = this.activeformContext;

                onWidgetInvalid && onWidgetInvalid(e);
            }
        }
    }

    let HoistedComponent = hoistNonReactStatics(WidgetWrapper, UnwrappedComponent) as React.ComponentType<Props>;

    // 通过JSX.LibraryManagedAttributes实现props和Class.defaultProps的关联
    return React.forwardRef((props: JSX.LibraryManagedAttributes<ClassType, OriginProps>, ref: React.RefObject<any>) => {
        return <HoistedComponent {...props as any} forwardedRef={ref} />;
    });
}