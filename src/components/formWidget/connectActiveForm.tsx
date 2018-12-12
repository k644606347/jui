import * as React from "react";
import { ActiveFormContext } from "./ActiveFormContext";
import hoistNonReactStatics from "../../utils/hoistNonReactStatics";

export default function connectActiveForm<ClassType, OriginProps>(UnwrappedComponent: React.ComponentType<OriginProps>) {
    type Props = OriginProps & {
        forwardedRef?: React.RefObject<any>;
    };

    class Wrapper extends React.PureComponent<Props, any> {
        static defaultProps = UnwrappedComponent.defaultProps;
        constructor(props: Props) {
            super(props);
        }
        render() {
            let { props } = this,
                { forwardedRef, ...restProps } = props as any;// TODO 此处必须转换为any，不然无法使用rest语法

            return (
                <ActiveFormContext.Consumer>
                    {context => {
                        return <UnwrappedComponent {...restProps} 
                                    activeFormContext={context} 
                                    ref={(component: React.Component) => {
                                        if (!component) {
                                            return;
                                        }
                                        
                                        if (forwardedRef)
                                            forwardedRef.current = component;
                                    }}
                                />
                    }}
                </ActiveFormContext.Consumer>
            )
        }
    }

    let HoistedComponent = hoistNonReactStatics(Wrapper, UnwrappedComponent) as React.ComponentType<Props>;

    // 通过JSX.LibraryManagedAttributes实现props和Class.defaultProps的关联
    return React.forwardRef((props: JSX.LibraryManagedAttributes<ClassType, OriginProps>, ref: React.RefObject<any>) => {
        return <HoistedComponent {...props as any} forwardedRef={ref} />;
    });
}