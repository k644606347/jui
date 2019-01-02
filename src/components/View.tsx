import * as React from "react";

class View<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    constructor(props) {
        super(props);

        this.initRender();
    }
    initRender() {
        let render = this.render.bind(this),
            proxy = (): React.ReactNode => {
                let result = render();

                if (React.isValidElement(result)) {
                    return React.cloneElement(result as React.ReactElement<any>, {
                        component: this.constructor.name
                    });
                } else {
                    return result;
                }
            }
        this.render = proxy.bind(this);
    }
}

export default View;