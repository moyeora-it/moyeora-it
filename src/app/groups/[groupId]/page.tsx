import { GroupDescription } from '@/components/atoms/group-description';
import { GroupActionButtons } from '@/components/molecules/gorup-action-buttons';
import { Empty } from '@/components/organisms/empty';
import { GroupDetaiilCard } from '@/components/organisms/group-detail-card';
import { ReplySection } from '@/components/organisms/reply/reply-section';
import { GroupDetail } from '@/types';
import { getAuthCookieHeader } from '@/utils/cookie';
import { isBeforeToday } from '@/utils/dateUtils';
import { notFound } from 'next/navigation';

type GroupDetailResponse = {
  status: {
    code: number;
    message: string;
    success: boolean;
  };
  items: GroupDetail;
};

type GroupDetailPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const groupId = Number((await params).groupId);
  const cookieHeaderValue = await getAuthCookieHeader();

  let response: Response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/${groupId}`,
      {
        headers: {
          Cookie: cookieHeaderValue,
        },
        next: { tags: [`group-detail-${groupId}`] },
      },
    );
  } catch (error) {
    console.error('Fetch 요청 실패:', error);
    return (
      <Empty
        mainText="서버와 연결할 수 없습니다."
        subText="잠시 후 다시 시도해주세요."
        className="text-center mt-40 mx-5"
      />
    );
  }

  if (response.status === 404) {
    return notFound();
  }

  if (!response.ok) {
    console.error('응답 상태 오류:', response.status);
    return <Empty mainText="모임 정보를 불러오는 데 문제가 발생했습니다." />;
  }

  let responseBody: GroupDetailResponse;

  try {
    responseBody = await response.json();
  } catch (err) {
    console.error('JSON 파싱 오류:', err);
    return <Empty mainText="모임 정보를 처리하는 중 문제가 발생했습니다." />;
  }

  if (!responseBody.items) {
    return notFound();
  }

  if (!responseBody.status.success) {
    console.error('API 성공 상태 false:', responseBody.status);
    return <Empty mainText="모임 정보를 불러오는 데 실패했습니다." />;
  }

  const data = responseBody.items;
  console.log(data);

  const { group, host, isApplicant, isJoined } = data;

  const isRecruiting =
    !isBeforeToday(group.deadline) &&
    group.participants.length < group.maxParticipants;

  return (
    <>
      <main className="mx-auto flex flex-col gap-10 mb-15">
        <div className="bg-gray-50 items-center py-15 px-5 sm:px-10">
          <GroupDetaiilCard info={data} isRecruiting={isRecruiting} />
        </div>
        <div className="mx-auto flex flex-col gap-10 w-full max-w-[900px] max-[900px]:px-10 px-6">
          <GroupDescription
            description={group.description}
            groupType={group.type}
          />
          <ReplySection groupId={groupId} />
        </div>
      </main>
      {isRecruiting && (
        <footer className="fixed bottom-0 left-0 z-50 bg-white border-t-2 py-2 px-8 w-full flex justify-end gap-4">
          <GroupActionButtons
            groupId={groupId}
            hostId={host.userId}
            isApplicant={isApplicant}
            isJoined={isJoined}
            autoAllow={group.autoAllow}
          />
        </footer>
      )}
    </>
  );
}
