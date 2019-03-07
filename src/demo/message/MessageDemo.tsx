import { Message } from "../../JUI";
import * as React from "react";

export default () => {
    return (
        <React.Fragment>
            <Message type="error">success</Message>
            <Message type="warn">success</Message>
            <Message type="info">success</Message>
            <Message type="success">success</Message>
            <Message type="error" showIcon={false}>success</Message>
        </React.Fragment>
    )
}