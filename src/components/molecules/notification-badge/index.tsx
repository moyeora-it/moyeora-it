import { Badge } from '@/components/ui/badge';

/**
 * 안 읽은 알람이 있는 경우 활성화 -> 안 읽은 알람개수 업데이트 필요한 경우 추가 필요
 * @returns 
 */
export const NotificationBadge = () => {
  return (
    <Badge className='w-2 h-2 p-0 absolute top-0 right-0 bg-red-500'/>
  )
};
