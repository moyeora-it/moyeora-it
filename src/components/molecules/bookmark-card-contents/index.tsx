import { Badge } from '@/components/atoms/badge';
import { Title } from '@/components/atoms/title';
import { ContentInfo } from '@/components/organisms/bookmark-card';
import { Progress } from '@/components/ui/progress';
import { BookmarkButtonContainer } from '@/features/bookmark/components/bookmark-button-container';
import { getPosition } from '@/types/enums';
import { formatYearMonthDayWithDot } from '@/utils/dateUtils';

type BookmarkCardContentsProps = {
  className?: string;
  info: ContentInfo;
};

export const BookmarkCardContents = ({
  className,
  info,
}: BookmarkCardContentsProps) => {
  const isCompleted = info.participants.length === info.maxParticipants;
  return (
    info && (
      <section className={`${className} flex flex-col justify-between`}>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <header>
              <Title title={info.title} />
            </header>
            <div className="flex flex-row gap-2">
              <Badge
                text={formatYearMonthDayWithDot(info.deadline)}
                className="bg-gray-200 text-gray-500"
              />
              {info.position.map((position) => (
                <Badge
                  text={getPosition(position)}
                  className="bg-gray-900 text-gray-100"
                  key={position}
                />
              ))}
            </div>
          </div>
          <BookmarkButtonContainer
            isBookmark={info.isBookmark}
            groupId={info.id}
          />
        </div>
        <footer>
          <div className="flex flex-col gap-2">
            <p>
              <span>
                {info.participants.length}/{info.maxParticipants}
              </span>
            </p>
            <div className="flex flex-row gap-2">
              <Progress value={50} />
              <span>{isCompleted ? '완료' : '모집중'}</span>
            </div>
          </div>
        </footer>
      </section>
    )
  );
};
