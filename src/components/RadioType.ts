export interface RadioChangeEvent {
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
    onChange?: (e: RadioChangeEvent) => void;
}