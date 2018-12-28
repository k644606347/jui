import * as React from "react";
import { ActiveFormContext, ActiveFormContextType } from "./ActiveFormContext";
import { FormWidgetChangeEvent } from "./Widget";
import { CheckboxChangeEvent } from "../Checkbox";
import { RadioChangeEvent } from "../Radio";

interface Props {
    children: JSX.Element;
}
export type FieldChangeEvent = React.ChangeEvent<any> | FormWidgetChangeEvent | CheckboxChangeEvent | RadioChangeEvent;

class Field extends React.PureComponent<Props>{
    private activeformContext: ActiveFormContextType;
    private fieldInstance: React.ReactInstance;
    constructor(props) {
        super(props);

        this.handleRef = this.handleRef.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let { props } = this,
            { children } = props;

        return (
            <ActiveFormContext.Consumer>
                {context => {
                    this.activeformContext = context;

                    return React.cloneElement(children, {
                        ref: this.handleRef,
                        onChange: this.handleChange
                    })
                }}
            </ActiveFormContext.Consumer>
        )
    }
    handleRef(component: React.ReactInstance) {
        this.fieldInstance = component;

        // console.log('handleRef',component);
        // let originalRef = (this.props.children as any).ref;
        // if (tools.isFunction(originalRef)) {
        //     originalRef(component);
        // } else if (tools.isPlainObject(originalRef) && originalRef.hasOwnProperty('current')) {
        //     originalRef.current = component;
        // }
    }
    componentDidMount() {
        if (this.activeformContext) {
            let { onFieldMount } = this.activeformContext,
                fieldInstance = this.fieldInstance;

            onFieldMount && fieldInstance && onFieldMount(fieldInstance);
        }
    }
    handleChange(e: FieldChangeEvent) {
        let childrenProps = this.props.children.props;

        childrenProps.onChange && childrenProps.onChange(e);

        if (this.activeformContext.onFieldChange) {
            this.activeformContext.onFieldChange(e);
        }
    }
}

export default Field;