'use client';

import { Avatar } from '@/components/atoms/avatar';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/features/user/utils/validateImageFile';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import { type FormData } from '@/features/user/components/edit-user-profile-form/edit-user-profile-form';
import { request } from '@/api/request';

type EditableAvatarProps = {
  imageSrc: string;
  fallback: string;
};

/**
 * 수정 가능한 아바타 컴포넌트
 *
 * @param imageSrc 이미지 주소(문자열)
 * @param fallback 아바타 폴백 문자열(문자열)
 * @returns 수정 가능한 아바타 컴포넌트
 */
export const EditableAvatar = ({ imageSrc, fallback }: EditableAvatarProps) => {
  const { register, setValue } = useFormContext<FormData>();

  const { ref: registerRef, ...rest } = register('profileImageFile');

  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일이 변경될 때 실행되는 함수
   *
   * 유효한 이미지 파일인 경우, 미리보기 이미지 주소를 업데이트하고, 파일을 폼 데이터에 추가한다.
   * 그렇지 않은 경우, 토스트 메시지를 표시.
   *
   * @param e 파일 변경 이벤트
   */
  const fileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const { isValid, errorMessage } = validateImageFile(file);
      if (isValid) {
        setCurrentImageSrc(URL.createObjectURL(file));
        setValue('profileImageFile', file);
      } else {
        toast.error(errorMessage);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 프로필 이미지 제거 버튼 클릭 핸들러
   * 
   * 프로필 이미지를 제거하고, 수정 폼에서 보이는 이미지 경로를 업데이트한다.
   * 프로필 이미지 제거 요청이 실패하면, 토스트 메시지를 표시한다.
   */
  const removeProfileImgButtonClickHandler = async () => {
    try {
      await request.delete('/v1/user/profile-image-delete', {
        credentials: 'include',
      });
      setCurrentImageSrc('/images/default-profile.png');
      setValue('profileImageFile', null);
    } catch {
      toast.error('프로필 이미지 삭제에 실패하였습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  return (
    <div className={'relative'}>
      <div className="flex flex-col gap-y-3 items-center">
        <Avatar
          imageSrc={currentImageSrc}
          fallback={fallback}
          className={'size-20'}
        />
        <div className="flex flex-col gap-y-2">
          <Button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="h-8 rounded-[6px] text-sm font-medium bg-white text-gray-500 border cursor-pointer border-gray-300 shadow-none hover:bg-gray-50"
          >
            사진 업로드
          </Button>
          <button
            type="button"
            onClick={removeProfileImgButtonClickHandler}
            className="h-8 text-sm font-medium bg-white text-gray-400 shadow-none hover:bg-none cursor-pointer"
          >
            사진 제거
          </button>
        </div>
      </div>
      <input
        type={'file'}
        accept={'image/*'}
        className={'absolute inset-0 w-full h-full hidden'}
        multiple={false}
        {...rest}
        ref={(e) => {
          registerRef(e);
          fileInputRef.current = e;
        }}
        onChange={fileChangeHandler}
      />
    </div>
  );
};
