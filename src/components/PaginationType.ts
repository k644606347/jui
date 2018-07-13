import Button from "./Button";

export interface IChangeEvent {
    current: number;
}
export interface IPaginationProps {
    current: number;
    total: number;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
    prevBtn?: Button;
    nextBtn?: Button;
    prevBtnText?: string;
    nextBtnText?: string;
    onChange?: (e: IChangeEvent) => void;
}