import { Context1 } from "./Contexts";

import * as React from "react";
import Button from "../../components/Button";
import Log from "../../utils/Log";

interface Props {}
interface State {
    name: string;
}
export default class MultiContextConsumer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: 'na1',
        }
    }
    render() {
        console.log(this.state.name);

        return (
            <React.Fragment>
                <Button onClick={this.handleRename}>rename to na2</Button>
                <Context1.Consumer>
                    {topContext => {
                        console.log(this.state.name);
                        Log.log("Top Context1.Consumer=", topContext);
                        return (
                            <Context1.Consumer>
                                {nestedContext => {
                                    console.log('Context1.Consumer!');
                                    return (
                                        <div>
                                            <p>
                                                Top Context1.Consumer=
                                                {JSON.stringify(topContext)}
                                            </p>
                                            <p>
                                                Nested Context1.Consumer=
                                                {JSON.stringify(nestedContext)}
                                            </p>
                                            <p>
                                                Top Context1 和 Nested Context1
                                                会消费离自己最近的父级Provider的数据
                                            </p>
                                        </div>
                                    );
                                }}
                            </Context1.Consumer>
                        );
                    }}
                </Context1.Consumer>
            </React.Fragment>
        )
    }
    handleRename = (e: any) => {
        this.setState({ name: 'na2' });
    }
}
