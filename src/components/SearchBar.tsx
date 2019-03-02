import { CSSAttrs } from "../utils/types";
import * as React from "react";
import NavBar from "./NavBar";
import searchBarCSS from './SearchBar.scss';
import Input from "./formWidget/Input";
import View from "./View";
import { tools } from "../utils/Tools";

tools.useCSS(searchBarCSS);
interface BarProps extends CSSAttrs {
    onCancel?(): void;
}
export default class SearchBar extends React.PureComponent<BarProps> {
    cssObject = searchBarCSS;
    constructor(props: BarProps) {
        super(props);

        this.handleCancel = this.handleCancel.bind(this);
    }
    render() {
        return (
            <NavBar leftContent={""} rightContent={"取消"} onRightClick={this.handleCancel}>
                <Input />
            </NavBar>
        );
    }
    handleCancel(e: React.MouseEvent) {
        let { onCancel } = this.props;

        onCancel && onCancel();
    }
}
