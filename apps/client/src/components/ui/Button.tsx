import { Button as UIButton } from "@repo/ui/components";

function Button({ type = "button", ...props }: React.ComponentProps<typeof UIButton>) {
  return <UIButton {...props} type={type} />;
}

export default Button;
