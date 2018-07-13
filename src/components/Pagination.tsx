import { IPaginationProps, IChangeEvent } from "./PaginationType";
import * as React from "react";
import cssModules from './Pagination.scss';
import Button from "./Button";
import Tools from "../utils/Tools";

export default class Pagination extends React.PureComponent<IPaginationProps, any> {
    constructor(props: IPaginationProps) {
        super(props);

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    public render() {
        let { props } = this,
            { current, total, disabled, prevBtn, nextBtn } = props;

        return (<div className={Tools.classNames(cssModules.pagination, cssModules.disabled)}>
            {prevBtn ? prevBtn : <Button icon="left" inline={true} onClick={this.handlePrev} disabled={disabled}>上一页</Button>}
            <div><span className={cssModules.current}>{current}</span> / <span>{total}</span></div>
            {nextBtn ? nextBtn : <Button icon="right" inline={true} onClick={this.handleNext} disabled={disabled}>下一页</Button>}
        </div>);
    }
    public handlePrev() {
        let { current } = this.props;
    
        this.handleChange({ current: current - 1});
    }
    public handleNext() {
        let { current } = this.props;
        
        this.handleChange({ current: current + 1});
    }
    public handleChange(e: IChangeEvent) {
        let { onChange } = this.props;
        
        onChange && onChange(e);
    }
}