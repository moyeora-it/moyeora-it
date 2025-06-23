'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChangePasswordForm } from './account-settings/change-password-form';

/**
 * 계정 설정 모달 컴포넌트
 *
 * 계정 설정 모달에서 비밀번호를 변경할 수 있다.
 *
 * @returns 계정 설정 모달 컴포넌트
 */
export const AccountSettingsDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-x-1 text-sm font-medium text-gray-500 cursor-pointer"
          >
            계정 설정
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>계정 설정</DialogTitle>
            <DialogDescription>
              비밀번호를 변경할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col divide-y-1 divide-gray-200">
            <ChangePasswordForm closeDialog={closeDialog} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
