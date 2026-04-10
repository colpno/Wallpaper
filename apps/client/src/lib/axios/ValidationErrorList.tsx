import type { ValidationErrorPayload } from "@repo/types";

type Props = {
  errors: ValidationErrorPayload;
};

function ValidationErrorList({ errors }: Props) {
  return (
    <div className="space-y-1">
      {errors.map((error) => (
        <div key={error.path} className="leading-5">
          <strong>{error.path}:</strong>{" "}
          {error.message.endsWith(".") ? error.message : `${error.message}.`}
        </div>
      ))}
    </div>
  );
}

export default ValidationErrorList;
