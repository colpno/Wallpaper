import type { Dialog } from "@repo/ui/components";

import AuthForm from "@/features/auth/components/AuthForm";

import FormDialog from "../dialogs/FormDialog";
import Icon from "../ui/Icon";

type Props = {
  trigger?: React.ReactNode;
} & Pick<React.ComponentProps<typeof Dialog>, "onOpenChange" | "open" | "modal" | "defaultOpen">;

function LoginDialogForm({ trigger, ...props }: Props) {
  return (
    <FormDialog {...props} trigger={trigger} slotProps={{ trigger: { asChild: !!trigger } }}>
      <Icon variant="favicon" className="m-[8px_auto_6px]" />
      <AuthForm className="py-0" defaultForm="login" />
    </FormDialog>
  );
}

export default LoginDialogForm;
