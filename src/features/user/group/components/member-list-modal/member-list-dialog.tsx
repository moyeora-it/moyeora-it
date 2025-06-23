import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GroupMemberList } from '@/features/user/group/components/member-list-modal/group-member-list';
import { ArrowUpRight } from 'lucide-react';

type MemberListDialogProps = {
  groupId: string;
  groupTitle: string;
};

/**
 * 모임 참여/신청자 목록 모달 컴포넌트
 *
 * 모임 참여/신청자 목록을 보여준다.
 *
 * @param groupId 모임 id
 * @param groupTitle 모임 제목
 * @returns 모임 참여/신청자 목록 모달 컴포넌트
 */
export const MemberListDialog = ({
  groupId,
  groupTitle,
}: MemberListDialogProps) => {
  return (
    <div className="absolute bottom-3 right-4">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="inline-flex items-center gap-x-0.5 cursor-pointer self-end text-sm text-gray-500"
            type="button"
          >
            <ArrowUpRight className="size-5" />
            참여/신청자 목록
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-80 h-[25rem] overflow-y-auto scrollbar-hide flex flex-col">
          <DialogHeader>
            <DialogTitle className="mt-2">
              <span className="text-green-500">{`"${groupTitle}"`}</span> 모임의
              참여/신청자 목록
            </DialogTitle>
          </DialogHeader>
          <GroupMemberList groupId={groupId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
