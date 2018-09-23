import { Context1 } from "./Contexts";
import * as React from "react";
import MultiContextConsumer from "./MultiContextConsumer";

export default (props: any) => (
    <Context1.Provider value={{ id: "Top ID" }}>
        <Context1.Provider value={{ id: "Nested ID" }}>
            {<MultiContextConsumer />}
        </Context1.Provider>
    </Context1.Provider>
);
