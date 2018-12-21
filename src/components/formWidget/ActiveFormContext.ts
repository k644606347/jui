import * as React from "react";
import { Report } from "./Validator";
import Widget, { FormWidgetProps } from "./Widget";
type ReportMap = {[k in string]: Report};
export interface ActiveFormContextType {
    validating: boolean,
    isValid: boolean,
    validateReportMap: ReportMap,
    submitting: boolean,
    onWidgetMount?: (widgetInstance: React.Component<FormWidgetProps> & Widget) => void,
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);