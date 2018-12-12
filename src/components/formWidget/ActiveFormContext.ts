import * as React from "react";
import { FormWidgetValidEvent } from "./Widget";
import { Report } from "./Validator";

export interface ActiveFormContextType {
    onWidgetChange?: (...args: any[]) => void,
    onWidgetMount?: (...args: any[]) => void,
    onWidgetValidating?(e: FormWidgetValidEvent): void;
    onWidgetValid?(e: FormWidgetValidEvent): void;
    onWidgetInvalid?(e: FormWidgetValidEvent): void;
    submitting?: boolean,
    validateResult: {[k in string]: Report},
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);