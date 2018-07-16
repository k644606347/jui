import { ISelectProps } from "./SelectType";
import * as React from "react";
import cssModules from './Select.scss';
import Tools from "../utils/Tools";

const tools = Tools.getInstace();
export default class Select extends React.PureComponent<ISelectProps, any> {
    constructor(props: ISelectProps) {
        super(props);

    }
    public render() {
        let { props } = this,
            { className, style } = props;
        
        return (<div style={style} className={tools.classNames(cssModules.select, className)}>

        </div>);
    }
}