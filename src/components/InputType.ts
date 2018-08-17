import { Omit } from '../utils/types';

type HTMLInputProps = Omit<
    React.HTMLProps<HTMLInputElement>,
    'onFocus' | 'onBlur' | 'onChange'
    >;
export interface InputProps extends HTMLInputProps {
    onFocus?: (e: InputFocusEvent) => void;
    onBlur?: (e: InputFocusEvent) => void;
    onChange?: (e: InputChangeEvent) => void;
}
interface InputEvent {
    name?: string;
    value: string;
}
export interface InputChangeEvent extends InputEvent {}
export interface InputFocusEvent extends InputEvent {}