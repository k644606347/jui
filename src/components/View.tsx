import * as React from "react";
import * as ReactDOM from "react-dom";

class View<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    constructor(props) {
        super(props);

        this.initComponentDidMount();
    }
    initComponentDidMount() {
        let componentDidMount = this.componentDidMount.bind(this),
            proxy = () => {
                let dom = ReactDOM.findDOMNode(this);
                
                if (dom instanceof Element) {
                    dom.setAttribute('jui-component', this.constructor.name);
                }
                componentDidMount();
            }
        this.componentDidMount = proxy.bind(this);
    }
    componentDidMount() {}
}

export default View;