import * as React from "react";
import { FormProps } from "./FormType";
import Tools from "../utils/Tools";
import Field from "./Field";
import { FieldProps } from "./FieldType";

const tools = Tools.getInstance();
export default class Form extends React.PureComponent<FormProps, any> {
    constructor(props: FormProps) {
        super(props);

    }
    render() {
        let { props, state } = this,
            { children } = props;
        return (
            <form>
                {
                    this.processChildren(children)
                }
            </form>
        )
    }
    private processChildren(children: React.ReactNode): React.ReactNode {
        if (!tools.isArray(children)) {
            return Field.isField(children) ? this.bindField(children as React.ReactElement<FieldProps>) : children;
        } else {
            return (children as React.ReactNode[]).map(n => this.processChildren(n));
        }
    }
    private bindField(field: React.ReactElement<FieldProps>) {
        let originOnChange = field.props.onChange,
            that = this;

        return React.cloneElement(field, {
            onChange(e: any) {
                originOnChange && originOnChange(e);

                that.handleChange(e);
            }
        })
    }
    // TOOD 回调处理
    handleChange(e: any) {
        let { onChange } = this.props;

        onChange && onChange(e);
    }
}