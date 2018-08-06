import Button from "./Button";

export interface PaginationChangeEvent {
    current: number;
    total: number;
    action: string;
}
export interface PaginationProps {
    current: number;
    total: number;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    prevBtn?: Button;
    nextBtn?: Button;
    prevText?: string;
    nextText?: string;
    onChange?: (e: PaginationChangeEvent) => void;
}