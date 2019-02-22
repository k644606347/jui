import * as React from "react";
import * as ReactDOM from "react-dom";

class View<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    constructor(props) {
        super(props);

        this.initComponentDidMount();
    }
    private initComponentDidMount() {
        let componentDidMount = this.componentDidMount.bind(this),
            componentName = this.getClass().componentName || this.getClass().name,
            proxy = () => {
                let dom = ReactDOM.findDOMNode(this);
                
                if (dom instanceof Element) {
                    dom.setAttribute('jui-component', componentName);
                }
                componentDidMount();
            }
        this.componentDidMount = proxy.bind(this);
    }
    getClass(): any {
        return this.constructor;
    }
    componentDidMount() {}
}

export default View;