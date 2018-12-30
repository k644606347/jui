import * as React from "react";
import { Report } from "./Validator";
import { FieldChangeEvent } from "./Field";
import { ActiveFormValue } from "./ActiveForm";
type ReportMap = {[k in string]: Report};

// React.Component<FormWidgetProps> & Widget
export interface ActiveFormContextType {
    value: ActiveFormValue,
    validating: boolean,
    isValid: boolean,
    validateReportMap: ReportMap,
    submitting: boolean,
    onFieldMount(instace: React.ReactInstance): void,
    onFieldChange(e: FieldChangeEvent): void,
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);