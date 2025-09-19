import { Form as FormikForm, Formik, FormikConfig, FormikValues } from 'formik';
import { memo } from 'react';

interface Props<T extends FormikValues> extends FormikConfig<T> {
  onSubmit: (values: T) => Promise<void> | void;
}

function Form<T extends FormikValues = FormikValues>({ children, ...props }: Props<T>) {
  return (
    <Formik {...props}>
      {typeof children === 'function' ? (
        (props) => children(props)
      ) : (
        <FormikForm>{children}</FormikForm>
      )}
    </Formik>
  );
}

export default memo(Form);
