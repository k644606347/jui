import * as React from "react";

export const FormContext = React.createContext({
    onChange: (...args: any[]) => {},
    onWidgetMount: (...args: any[]) => {},
});