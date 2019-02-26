import { Context1 } from "./Contexts";
import * as React from "react";
import MultiContextConsumer from "./MultiContextConsumer";
import MiddleComponent from "./MiddleComponent";
import Button from "../../components/Button";

interface Props {

}
interface State {
    providerValue: {
        id: string;
    }
}
export default class MultiContextProvider extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            providerValue: {
                id: 'Nested ID'
            }
        }
    }
    render() {
        let { props } = this;
        
        return (
            <Context1.Provider value={{ id: "Top ID" }}>
                <Context1.Provider value={this.state.providerValue}>
                    {<MiddleComponent />}
                </Context1.Provider>
                <Button onClick={this.handleBtnClick}>set Context value</Button>
            </Context1.Provider>
        );
    }
    handleBtnClick = () => {
        this.setState({providerValue: {id: 'dddd'}});
    }
}
