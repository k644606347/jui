import * as React from "react";

interface FormContextType {
    onWidgetChange?: (...args: any[]) => void,
    onWidgetMount?: (...args: any[]) => void,
    submitting?: boolean,
}
export const FormContext = React.createContext({} as FormContextType);