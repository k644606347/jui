
export interface CheckboxChangeEvent {
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
}
export interface CheckboxProps {
    name: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onChange?: (e: CheckboxChangeEvent) => void;
}