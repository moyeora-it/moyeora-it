'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const ShareButton = () => {
  const shareButtonClickHandler = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(`${currentUrl}`);
      toast.success('링크가 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 실패하였습니다.');
    }
  };

  return (
    <Button onClick={shareButtonClickHandler} className="cursor-pointer">
      공유하기
    </Button>
  );
};
