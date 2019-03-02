import { PaginationProps, PaginationChangeEvent } from "./PaginationType";
import * as React from "react";
import Button from "./Button";
import { tools } from "../utils/Tools";
import paginationCSS from './Pagination.scss';
import View from "./View";

let cssModules = tools.useCSS(paginationCSS);

export default class Pagination extends React.PureComponent<PaginationProps> {
    public static defaultProps: PaginationProps = {
        current: 1,
        total: 1,
        prevText: '上一页',
        nextText: '下一页',
    };
    cssObject = paginationCSS;
    constructor(props: PaginationProps) {
        super(props);

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { props } = this,
            { current, total, disabled, prevBtn, nextBtn, prevText, nextText } = props;

        return (<div className={tools.classNames(cssModules.pagination, cssModules.disabled)}>
            {prevBtn ? prevBtn : <Button icon="left" onClick={this.handlePrev} disabled={disabled}>{prevText}</Button>}
            <div><span className={cssModules.current}>{current}</span> / <span>{total}</span></div>
            {nextBtn ? nextBtn : <Button icon="right" onClick={this.handleNext} disabled={disabled}>{nextText}</Button>}
        </div>);
    }
    public handlePrev() {
        let { current, total } = this.props;
    
        this.handleChange({ current: current - 1, total, action: 'prev'});
    }
    public handleNext() {
        let { current, total } = this.props;
        
        this.handleChange({ current: current + 1, total, action: 'next'});
    }
    public handleChange(e: PaginationChangeEvent) {
        let { onChange } = this.props;
        
        onChange && onChange(e);
    }
}