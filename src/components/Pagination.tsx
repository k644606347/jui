import { IPaginationProps, IChangeEvent } from "./PaginationType";
import * as React from "react";
import cssModules from './Pagination.scss';
import Button from "./Button";
import Tools from "../utils/Tools";

const tools = Tools.getInstance();
export default class Pagination extends React.PureComponent<IPaginationProps, any> {
    public static defaultProps: IPaginationProps = {
        current: 1,
        total: 1,
        prevText: '上一页',
        nextText: '下一页',
    };
    constructor(props: IPaginationProps) {
        super(props);

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { props } = this,
            { current, total, disabled, prevBtn, nextBtn, prevText, nextText } = props;

        return (<div className={tools.classNames(cssModules.pagination, cssModules.disabled)}>
            {prevBtn ? prevBtn : <Button icon="left" inline={true} onClick={this.handlePrev} disabled={disabled}>{prevText}</Button>}
            <div><span className={cssModules.current}>{current}</span> / <span>{total}</span></div>
            {nextBtn ? nextBtn : <Button icon="right" inline={true} onClick={this.handleNext} disabled={disabled}>{nextText}</Button>}
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
    public handleChange(e: IChangeEvent) {
        let { onChange } = this.props;
        
        onChange && onChange(e);
    }
}