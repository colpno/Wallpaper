import AuthForm from "@/features/auth/components/AuthForm";

import FormDialog from "../dialogs/FormDialog";
import Icon from "../ui/Icon";

type Props = {
  trigger?: React.ReactNode;
} & React.ComponentProps<typeof FormDialog>;

function RegisterDialogForm({ trigger, ...props }: Props) {
  return (
    <FormDialog
      {...props}
      trigger={trigger}
      slotProps={{
        ...props.slotProps,
        trigger: { ...props.slotProps?.trigger, asChild: !!trigger },
      }}
    >
      <Icon variant="favicon" className="m-[8px_auto_6px]" />
      <AuthForm className="py-0" defaultForm="register" />
    </FormDialog>
  );
}

export default RegisterDialogForm;
