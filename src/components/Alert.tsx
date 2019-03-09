import * as React from "react";
import alertCSS from './Alert.scss';
import { tools } from "../utils/Tools";

let cssModules = tools.useCSS(alertCSS);
// TODO
export interface AlertProps {

}
export interface AlertState {

}
export default class Alert extends React.PureComponent {
    render() {
        return <div></div>
    }
}