export interface RadioChangeEvent {
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
}
export interface RadioProps {
    name: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onChange?: (e: RadioChangeEvent) => void;
}