'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditUserProfileForm } from '@/features/user/components/edit-user-profile-form/edit-user-profile-form';

/**
 * 프로필 수정 모달 컴포넌트
 *
 * @returns 프로필 수정 모달 컴포넌트
 */

export const EditUserProfileDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button type="button">
          <Image src="/icons/btn_edit.svg" alt="edit" width={32} height={32} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]! md:max-w-[450px]!  p-0">
        <DialogHeader>
          <DialogTitle className='text-center pt-4'>프로필 수정하기</DialogTitle>
        </DialogHeader>
        <div className={'flex flex-col gap-y-4 mt-4'}>
          <EditUserProfileForm closeDialog={closeDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
