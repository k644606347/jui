import { Context1 } from "./Contexts";

import { Log, Input } from "../..";

import * as React from "react";

export default (props: any) => (
    <Context1.Consumer>
        {topContext => {
            Log.log("Top Context1.Consumer=", topContext);
            return (
                <Context1.Consumer>
                    {nestedContext => {
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
);
