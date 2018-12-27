import * as React from "react";
import { Report } from "./Validator";
import Widget, { FormWidgetProps } from "./Widget";
import { FieldChangeEvent } from "./Field";
type ReportMap = {[k in string]: Report};

// React.Component<FormWidgetProps> & Widget
export interface ActiveFormContextType {
    validating: boolean,
    isValid: boolean,
    validateReportMap: ReportMap,
    submitting: boolean,
    onFieldMount(instace: React.ReactInstance): void,
    onFieldChange(e: FieldChangeEvent): void,
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);