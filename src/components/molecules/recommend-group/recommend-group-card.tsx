import { Badge } from '@/components/atoms/badge';
import { HalfRoundBadge } from '@/components/atoms/badge/half-round-badge';
import { RecommendDeadline } from '@/components/atoms/recommend/recommend-deadline';
import { RecommendGroupTitle } from '@/components/atoms/recommend/recommend-group-title';
import { Group, GroupTypeName } from '@/types';
import {
  formatRelativeTime,
  formatYearMonthDayWithDot,
} from '@/utils/dateUtils';
import { routes } from '@/utils/routes';
import Link from 'next/link';

type RecommendGroupCardProps = {
  item: Group;
};

// TODO : 섹션별로 component 나누기
export const RecommendGroupCard = ({ item }: RecommendGroupCardProps) => {
  return (
    <div className="w-[210px] h-[120px] lg:w-[276px] lg:h-[160px] p-4 lg:p-6  bg-white ring-2 ring-gray-400/30 rounded-2xl">
      <Link href={routes.groupDetail(item.id)}>
        <div className="flex justify-between">
          <Badge
            text={GroupTypeName[item.type]}
            className="hidden lg:block h-[22px] text-xs md:text-sm font-semibold bg-gray-200"
          />
          <HalfRoundBadge
            text={`🚨마감 ${
              formatRelativeTime(item.deadline).includes('년')
                ? formatRelativeTime(item.deadline).slice(6)
                : formatRelativeTime(item.deadline)
            }`} // formatRelativeTime이 년월일을 표기해야 하는 함수라서 월일만 자름
            className="h-[22px] text-xs  text-red-600 border-1 border-red-600"
          />
        </div>
        <RecommendDeadline text={formatYearMonthDayWithDot(item.endDate)} />
        <RecommendGroupTitle text={item.title} />
      </Link>
    </div>
  );
};
