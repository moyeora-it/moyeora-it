import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputTextField } from '@/components/molecules/input-text-field';
import { useChangePassword } from '@/features/user/hooks/useChangePassword';

const schema = z.object({
  newPassword: z
    .string()
    .nonempty({ message: '새 비밀번호를 입력해주세요' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
      message:
        '영어 대/소문자, 숫자, 특수문자를 혼합하여 8자리 이상 입력해주세요.',
    }),
  currentPassword: z
    .string()
    .nonempty({ message: '기존 비밀번호를 입력해주세요' }),
});

type ChangePasswordFormProps = {
  closeDialog: () => void;
};

/**
 * 비밀번호 변경 폼 컴포넌트
 *
 * @param closeDialog 모달 닫는 함수
 * @returns 비밀번호 변경 폼 컴포넌트
 */
export const ChangePasswordForm = ({
  closeDialog,
}: ChangePasswordFormProps) => {
  const formMethods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      currentPassword: '',
    },
  });

  const { mutateAsync: changePassword } = useChangePassword();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      });
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...formMethods}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <InputTextField
          label="기존 비밀번호"
          name="currentPassword"
          form={formMethods}
          type="password"
        />

        <InputTextField
          label="새 비밀번호"
          name="newPassword"
          form={formMethods}
          type="password"
        />

        <Button
          className="self-end"
          type="submit"
          disabled={formMethods.formState.isSubmitting}
        >
          비밀번호 변경
        </Button>
      </form>
    </Form>
  );
};
