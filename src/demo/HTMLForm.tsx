import * as React from "react";
import Log from "../utils/Log";

export default function HTMLForm() {
    return <form onSubmit={e => {
        Log.log('HTMLForm onSubmit', e);
    }}>
        Name: <input type="text" name="usr_name" required />
        <input type="submit" value="提交" />
    </form>
}