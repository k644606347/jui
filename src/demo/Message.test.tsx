
import * as React from "react";
import { Message } from "..";

export default function MessageTest() {
    return <Message type="error" showIcon={true}>
        这是一个Error Message。
    </Message>
}