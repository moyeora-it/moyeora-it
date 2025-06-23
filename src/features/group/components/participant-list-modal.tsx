import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MemberInfo } from '@/features/user/group/components/member-list-modal/member-info';
import { UserSummary } from '@/types';
import { PlusIcon } from 'lucide-react';

type ParticipantListModalProps = {
  participants: UserSummary[];
  className?: string;
};

export const ParticipantListModal = ({
  participants,
  className = '',
}: ParticipantListModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`rounded-full border p-2 bg-white ${className}`}>
          <PlusIcon className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-80 p-0 gap-0">
        <DialogHeader className="sticky top-0 -z-10 rounded-t-lg bg-white p-4 border-b">
          <DialogTitle>참여자 목록</DialogTitle>
          <DialogDescription className="sr-only">
            이 모달은 참여자 목록을 보여줍니다.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] px-4 pt-6 pb-4 -z-20">
          <ul className="flex flex-col gap-4">
            {participants.map((participant) => (
              <li
                key={participant.userId}
                className="pb-5 border-b-2 border-gray-300 last:border-none border-dashed flex justify-between"
              >
                <MemberInfo {...participant} />
              </li>
            ))}{' '}
            {participants.map((participant) => (
              <li
                key={participant.userId}
                className="pb-5 border-b-2 border-gray-300 last:border-none border-dashed flex justify-between"
              >
                <MemberInfo {...participant} />
              </li>
            ))}{' '}
            {participants.map((participant) => (
              <li
                key={participant.userId}
                className="pb-5 border-b-2 border-gray-300 last:border-none border-dashed flex justify-between"
              >
                <MemberInfo {...participant} />
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
