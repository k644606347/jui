import * as React from "react";

export const FormContext = React.createContext({
    onWidgetChange: (...args: any[]) => {},
    onWidgetMount: (...args: any[]) => {},
});