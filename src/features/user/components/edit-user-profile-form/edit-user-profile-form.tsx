'use client';

import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditableAvatar } from '@/features/user/components/edit-user-profile-form/editable-avatar';
import { Form } from '@/components/ui/form';
import { InputTextField } from '@/components/molecules/input-text-field';
import { InputSelectField } from '@/components/molecules/input-select-field';
import { SkillSelector } from '@/features/user/components/edit-user-profile-form/skill-selector';
import { Button } from '@/components/ui/button';
import { Position, Skill } from '@/types/enums';
import useAuthStore from '@/stores/useAuthStore';
import { useUpdateProfileMutation } from '@/features/user/hooks/useUpdateProfileMutation';
import { getDisplayProfileImage, getDisplayNickname } from '@/utils/fallback';

const schema = z.object({
  nickname: z.string().nonempty('닉네임을 입력해주세요.'),
  profileImageFile: z.custom<File>().nullable(),
  position: z.string().nullable(),
  skills: z.array(z.nativeEnum(Skill)),
});

type EditUserProfileFormProps = {
  closeDialog: () => void;
};

export type FormData = z.infer<typeof schema>;

/**
 * 사용자 프로필 수정 폼
 *
 * @param closeDialog 모달 닫는 함수
 * @returns 사용자 프로필 수정 폼 컴포넌트
 */
export const EditUserProfileForm = ({
  closeDialog,
}: EditUserProfileFormProps) => {
  const user = useAuthStore((state) => state.user);

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: user?.nickname ?? user?.email.split('@')[0],
      profileImageFile: null,
      position: user?.position ? String(user.position) : null,
      skills: user?.skills ?? [],
    },
  });

  const { mutateAsync: updateProfile } = useUpdateProfileMutation();
  const formSubmitHandler: SubmitHandler<FormData> = async (data) => {
    const { nickname, position, skills, profileImageFile } = data;

    try {
      await updateProfile({
        nickname,
        position: Number(position),
        skills,
        ...(profileImageFile && { file: profileImageFile }),
      });
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form
          className="flex flex-col gap-y-7"
          onSubmit={formMethods.handleSubmit(formSubmitHandler)}
        >
          <div className="flex gap-x-6 px-6">
            <EditableAvatar
              imageSrc={getDisplayProfileImage(user?.profileImage ?? null)}
              fallback={getDisplayNickname(
                user?.nickname ?? '',
                user?.email ?? '',
              )}
            />
            <div className="flex flex-col gap-y-[20px] flex-grow min-w-0">
              <InputTextField
                label="닉네임"
                name="nickname"
                form={formMethods}
                placeholder="수정할 닉네임을 입력해주세요."
              />
              <InputSelectField
                label="포지션"
                name="position"
                form={formMethods}
                placeholder="포지션 선택"
                options={Object.entries(Position)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => ({
                    label: key,
                    value: String(value),
                  }))}
                selectTriggerClassName="bg-gray-50 w-full border-none"
              />
            </div>
          </div>
          <SkillSelector />
          <div className="flex gap-x-2 justify-end border-t-[6px] border-[#f5f6f7] py-[20px] px-6">
            <Button
              className="w-1/2 shrink-0 h-12 text-sm rounded-lg font-semibold border-gray-300 text-gray-600"
              type="button"
              onClick={closeDialog}
              variant="outline"
            >
              취소하기
            </Button>
            <Button
              className="w-1/2 shrink-0 h-12 text-sm rounded-lg font-semibold"
              disabled={formMethods.formState.isSubmitting}
            >
              수정하기
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
