import * as React from "react";
import { FieldChangeEvent } from "./Field";
import { ActiveForm } from "./ActiveForm";
import { Report } from "./Validator";

// React.Component<FormWidgetProps> & Widget
export interface ActiveFormContextType {
    value: ActiveForm.Value,
    validating: boolean,
    isValid: boolean,
    validateReport: Report,
    fieldReportMap: ActiveForm.FieldReportMap,
    submitting: boolean,
    onFieldMount(instace: React.ReactInstance): void,
    onFieldChange(e: FieldChangeEvent): void,
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);