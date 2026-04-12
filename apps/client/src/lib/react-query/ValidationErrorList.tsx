import type { ValidationErrorPayload } from "@repo/types";

type Props = {
  issues: ValidationErrorPayload;
};

function ValidationErrorList({ issues }: Props) {
  return (
    <div className="space-y-1">
      {issues.map((error) => (
        <div key={error.path} className="leading-5">
          <strong>{error.path}:</strong>{" "}
          {error.message.endsWith(".") ? error.message : `${error.message}.`}
        </div>
      ))}
    </div>
  );
}

export default ValidationErrorList;
