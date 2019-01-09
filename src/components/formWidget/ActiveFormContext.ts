import * as React from "react";
import { FieldChangeEvent } from "./Field";
import { ActiveFormType } from "./ActiveForm";
import { Report } from "./Validator";

// React.Component<FormWidgetProps> & Widget
export interface ActiveFormContextType {
    value: ActiveFormType.Value,
    validating: boolean,
    isValid: boolean,
    validateReport: Report,
    fieldReportMap: ActiveFormType.FieldReportMap,
    submitting: boolean,
    onFieldMount(instace: React.ReactInstance): void,
    onFieldChange(e: FieldChangeEvent): void,
    validateRules: ActiveFormType.ValidateRules,
}
export const ActiveFormContext = React.createContext({} as ActiveFormContextType);