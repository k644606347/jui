import { Toast } from "src";
import * as React from "react";

export default (props: any) => {
    return (
        <React.Fragment>
            <Toast duration={0} overlay={true} {...props}>this is a Simple Toast</Toast>
            <Toast duration={0} overlay={true} type={'success'} {...props}>this is a Simple Toast</Toast>
            {/* <Toast duration={0} overlay={true} {...props}>this is a Simple Toast</Toast> */}
        </React.Fragment>
    )
}