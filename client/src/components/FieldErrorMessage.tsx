import { ErrorMessage } from 'formik';
import { memo } from 'react';

import { Typography } from './index.ts';

interface Props {
  fieldName: string;
}

function FieldErrorMessage({ fieldName }: Props) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => <Typography className="!text-red-500">{msg}</Typography>}
    />
  );
}

export default memo(FieldErrorMessage);
