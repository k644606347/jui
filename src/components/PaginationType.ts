import Button from "./Button";

export interface IChangeEvent {
    current: number;
    total: number;
    action: string;
}
export interface IPaginationProps {
    current: number;
    total: number;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    prevBtn?: Button;
    nextBtn?: Button;
    prevText?: string;
    nextText?: string;
    onChange?: (e: IChangeEvent) => void;
}