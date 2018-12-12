import { Context1 } from "./Contexts";
import MultiContextConsumer from "./MultiContextConsumer";
import * as React from "react";

function MiddleComponent2() {
    console.log('MiddleComponent2 rerender!');
    return <MultiContextConsumer></MultiContextConsumer>;
}
export default () => {
    console.log('MiddleComponent rerender!');
    return (
        <div>
            <MiddleComponent2></MiddleComponent2>
        </div>
    )
}