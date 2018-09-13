import { Message } from "../App";
import * as React from "react";

export default function MessageTest() {
    return <Message type="error" showIcon={true}>
        这是一个Error Message。
    </Message>
}