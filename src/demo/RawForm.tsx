import * as React from 'react';
import Log from '../utils/Log';
import Form, { FormProps } from '../components/Form';
import Input from '../components/formWidget/Input';
interface Props extends FormProps {
    forwardedRef?: React.RefObject<any>;
}
function HTMLForm(props: Props) {
    return (
        <Form
            ref={props.forwardedRef}
            onSubmit={e => {
                Log.log('HTMLForm onSubmit', e);
                
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            Name: <Input name="usr_name" />
            <input type="submit" value="提交" />
        </Form>
    );
}
export default React.forwardRef((props: Props, ref: React.RefObject<any>) => (
    <HTMLForm {...props} forwardedRef={ref} />
));
