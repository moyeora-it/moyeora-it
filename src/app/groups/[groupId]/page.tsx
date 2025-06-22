import { Empty } from '@/components/organisms/empty';
import { GroupActionButtons } from '@/features/group/components/group-action-buttons';
import { GroupDescription } from '@/features/group/components/group-description';
import { GroupDetailCard } from '@/features/group/components/group-detail-card';
import { ReplySection } from '@/features/reply/components/reply-section';
import { GroupDetail } from '@/types';
import { getAuthCookieHeader } from '@/utils/cookie';
import { isBeforeToday } from '@/utils/dateUtils';
import { Metadata } from 'next';
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

const convertHtmlToPlainText = (html: string) => {
  return html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1. ') // 헤딩은 강조
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1 ') // 단락 유지
    .replace(/<[^>]*>/g, '') // 나머지 태그 제거
    .replace(/\s+/g, ' ') // 공백 정리
    .trim();
};

const fallbackMetadata: Metadata = {
  title: '404 | 모여라-IT',
  description: '존재하지 않는 모임입니다.',
  openGraph: {
    title: '404 | 모여라-IT',
    description: '존재하지 않는 모임입니다.',
    images: [{ url: '/logos/logo-img.svg' }],
  },
};

export async function generateMetadata({
  params,
}: GroupDetailPageProps): Promise<Metadata> {
  const groupId = Number((await params).groupId);
  const cookieHeaderValue = await getAuthCookieHeader();

  let group;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/groups/${groupId}`,
      {
        headers: {
          Cookie: cookieHeaderValue,
        },
      },
    );

    if (!response.ok) return fallbackMetadata;

    const data: GroupDetailResponse = await response.json();

    group = data?.items?.group;
  } catch {
    return fallbackMetadata;
  }

  if (!group) return fallbackMetadata;

  const plainDescription = convertHtmlToPlainText(group.description);

  return {
    title: `${group.title} | 모여라-IT`,
    description: plainDescription,
    openGraph: {
      title: `${group.title} | 모여라-IT`,
      description: plainDescription,
      images: [{ url: '/logos/logo-img.svg' }],
    },
  };
}

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
          <GroupDetailCard info={data} isRecruiting={isRecruiting} />
        </div>
        <div className="mx-auto flex flex-col gap-15 w-full max-w-[900px] max-[900px]:px-10 px-6">
          <GroupDescription
            description={group.description}
            groupType={group.type}
          />
          <ReplySection />
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
