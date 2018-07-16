export interface IOption {
    label: string;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}
export interface IOptionGroup {
    label: string | JSX.Element;
    value: Array<IOption | never>;
    className?: string;
    style?: React.CSSProperties;
}
export interface ISelectProps {
    // children: JSX.Element[];
    data: Array<IOptionGroup | IOption>;
    className?: string;
    style?: React.CSSProperties;
    multiple?: boolean;
    onChange?: React.EventHandler<any>;
}