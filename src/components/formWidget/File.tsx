import Widget, { FormWidgetProps } from "./Widget";

import * as React from "react";
import { DataType } from "./stores/DataConvertor";

export interface FileProps extends FormWidgetProps {
    multiple?: boolean;
}
export default class File extends Widget<FileProps> {
    static defaultProps = {
        multiple: true
    };
    widgetName = "file";
    dataType: DataType = "string";
    inputRef = React.createRef<HTMLInputElement>();
    constructor(props) {
        super(props);
    }
    render() {
        let {  multiple } = this.props;
        return (
            <input
                type="file"
                multiple={multiple}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                ref={this.inputRef}
            />
        );
    }
    handleChange(e) {
        let files = e.target.files,
            { onChange } = this.props;

        onChange && onChange(this.buildEvent({
            value: files,
        }));
    }
}
