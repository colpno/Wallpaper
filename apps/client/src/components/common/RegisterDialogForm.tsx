import AuthForm from "@/features/auth/components/AuthForm";

import FormDialog from "../dialogs/FormDialog";
import Icon from "../ui/Icon";

type Props = {
  trigger: React.ReactNode;
};

function RegisterDialogForm({ trigger }: Props) {
  return (
    <FormDialog trigger={trigger} slotProps={{ trigger: { asChild: true } }}>
      <Icon variant="favicon" className="m-[8px_auto_6px]" />
      <AuthForm className="py-0" defaultForm="register" />
    </FormDialog>
  );
}

export default RegisterDialogForm;
