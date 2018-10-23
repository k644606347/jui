import * as React from "react";
import * as ReactDOM from "react-dom";
import cm from "./index.scss";
import Tools from "../utils/Tools";
import DevPane from "./DevPane";
import App from "./App";

const tools = Tools.getInstance();
ReactDOM.render(
    <React.Fragment>
        <div className={`global-class-name ${cm.class2}`}></div>
        <App />
        {tools.isDev() ? <DevPane /> : ""}
    </React.Fragment>,
    document.getElementById("root"));
