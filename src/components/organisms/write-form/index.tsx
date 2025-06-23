'use client';

import { request } from '@/api/request';
import { CategoryName } from '@/components/atoms/write-form/categoryName';
import { ErrorBoundary } from '@/components/error-boundary';
import { handleError } from '@/components/error-boundary/error-handler';
import { AutoAllow } from '@/components/molecules/write-form/autoAllow';
import { DeadlineCalendar } from '@/components/molecules/write-form/deadlineCalendar';
import { EndDateCalendar } from '@/components/molecules/write-form/endDateCalendar';
import { MaxParticipants } from '@/components/molecules/write-form/maxParticipants';
import { SelectType } from '@/components/molecules/write-form/selcetType';
import { SelectPosition } from '@/components/molecules/write-form/selectPosition';
import { SelectSkill } from '@/components/molecules/write-form/selectSkill';
import { StartDateCalendar } from '@/components/molecules/write-form/startDateCalendar';
import { Description } from '@/components/molecules/write-form/tiptap/desctiption';
import { Title } from '@/components/molecules/write-form/title';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  DEFAULT_POSITION_NAMES,
  DEFAULT_SKILL_NAMES,
  GroupType,
} from '@/types';
import { Position, Skill } from '@/types/enums';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { addDays, isAfter } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    title: z
      .string()
      .trim()
      .nonempty({ message: '제목을 입력해주세요.' })
      .max(100, {
        message: '제목이 너무 길어요. 100자 이내로 줄여주세요.',
      }),
    maxParticipants: z.coerce
      .number({ message: '모임의 정원을 설정해주세요.' })
      .min(2, {
        message: '최소 인원은 2명이상이어야 해요.',
      })
      .max(30, {
        message: '최대 인원은 30명까지 가능합니다.',
      }),
    deadline: z.date().min(addDays(new Date(), 0), {
      message: '모집 마감일은 오늘로부터 1일 이후부터 설정 가능합니다.',
    }),
    startDate: z.date(),
    endDate: z.date(),
    description: z
      .string()
      .min(20, { message: '내용을 좀 더 자세하게 적어주세요.' }),
    autoAllow: z.boolean(),
    type: z.enum([GroupType.STUDY, GroupType.PROJECT]),
    skills: z
      .array(
        z.union([
          z.enum(DEFAULT_SKILL_NAMES), // 미리 정해진 skill과
          z.string(), // 유저가 입력한 커스텀 skill을 합친 union 타입 형태로 유효성 검사
        ]),
        { required_error: '사용 기술을 한가지 이상 선택해주세요.' }, // 아예 선택도 하지 않은 경우
      )
      .min(1, { message: '사용 기술을 한가지 이상 선택해주세요.' }), // 선택했다가 지워서 [] 인 경우
    position: z
      .array(
        z.union([
          z.enum(DEFAULT_POSITION_NAMES), // 미리 정해진 position과
          z.string(), // 유저가 입력한 커스텀 skill을 합친 union 타입 형태로 유효성 검사
        ]),
        { required_error: '포지션을 한 가지 이상 선택해주세요.' }, // 아예 선택도 하지 않은 경우
      )
      .min(1, { message: '포지션을 한 가지 이상 선택해주세요.' }), // 선택했다가 지워서 [] 인 경우
  })
  .refine((data) => isAfter(data.startDate, addDays(data.deadline, 0)), {
    message: '모임 시작일은 모집 마감일로부터 1일 이후여야 합니다.',
    path: ['startDate'],
  })
  .refine((data) => isAfter(data.endDate, addDays(data.startDate, 6)), {
    message: '모임 종료일은 모집 시작일로부터 7일 이후여야 합니다.',
    path: ['endDate'],
  });

type WriteFormProps = {
  userId: number;
};

export const WriteForm = ({ userId }: WriteFormProps) => {
  const [isDeadlineCalendarOpen, setIsDeadlineCalendarOpen] = useState(false);
  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false);
  const [isEndDateCalendarOpen, setIsEndDateCalendarOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const validDeadline = addDays(new Date(), 7);

  const [selectedDeadline, setSelectedDeadline] = useState(validDeadline);

  const validStartDate = useMemo(
    () => addDays(selectedDeadline, 1),
    [selectedDeadline],
  );

  const validEndDate = useMemo(
    () => addDays(validStartDate, 7),
    [validStartDate],
  );

  const deadlineSelectHandler = (date: Date) => {
    setSelectedDeadline(date);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // 유효성 검사는 zodResolver로 한다
    reValidateMode: 'onSubmit', // submit 시에만 유효성 검사
    defaultValues: {
      title: '',
      maxParticipants: 2,
      description: '',
      autoAllow: false,
      type: GroupType.STUDY,
      deadline: validDeadline, // 선택하지 않았을 경우 validDeadline 그대로 사용
      startDate: validStartDate, // 선택하지 않았을 경우 validStartDate 일자 그대로 사용
      endDate: validEndDate, // 선택하지 않았을 경우 validEndDate 그대로 사용
    },
  });

  const cancelClickHandler = () => {
    router.push('/');
  };

  const formSubmit = async (values: z.infer<typeof formSchema>) => {
    const skills = values.skills.map(
      (skill) => Skill[skill as keyof typeof Skill],
    ); // server에 보낼때 enum의 인덱스로 보내기로 했으므로 string을 enum의 인덱스로 변환

    const position = values.position.map(
      (position) => Position[position as keyof typeof Position],
    ); // server에 보낼때 enum의 인덱스로 보내기로 했으므로 string을 enum의 인덱스로 변환

    try {
      const result = await request.post(
        `/v2/groups?userId=${userId}`,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ ...values, skills, position }),
        { credentials: 'include' },
      );

      if (result.status.success) {
        await queryClient.invalidateQueries({
          queryKey: ['items', '/v2/groups'],
        }); // 홈으로 이동 후 새로운 데이터로 갱신하기 위해 무효화 시킴

        router.push('/');
      } else {
        toast.error('에러가 발생했습니다. 다시 시도해주세요.');
        console.log(
          `Error code ${result.status.code} : ${result.status.message}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Group create error(server): ${
          error instanceof Error ? error.message : 'Unexpected Error'
        }`,
      );
    }
  };

  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) =>
        handleError({
          error,
          resetErrorBoundary,
          defaultMessage: '그룹 생성 중 문제가 발생했습니다.',
        })
      }
    >
      <div className="px-4 py-14">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmit)}
            className="flex flex-col gap-7"
          >
            <CategoryName number={1} text="모임 기본 정보를 입력해주세요." />
            <SelectType form={form} />
            <MaxParticipants form={form} />
            <DeadlineCalendar
              form={form}
              isDeadlineCalendarOpen={isDeadlineCalendarOpen}
              deadlineSelect={deadlineSelectHandler}
              openDeadlineCalendar={() => setIsDeadlineCalendarOpen(true)}
              closeDeadlineCalendar={() => setIsDeadlineCalendarOpen(false)}
              validDeadline={validDeadline}
            />
            <StartDateCalendar
              form={form}
              isStartDateCalendarOpen={isStartDateCalendarOpen}
              openStartDateCalendar={() => setIsStartDateCalendarOpen(true)}
              closeStartDateCalendar={() => setIsStartDateCalendarOpen(false)}
              validStartDate={validStartDate}
            />
            <EndDateCalendar
              form={form}
              isEndDateCalendarOpen={isEndDateCalendarOpen}
              openEndDateCalendar={() => setIsEndDateCalendarOpen(true)}
              closeEndDateCalendar={() => setIsEndDateCalendarOpen(false)}
              validEndDate={validEndDate}
            />
            <SelectSkill form={form} />
            <SelectPosition form={form} />
            <AutoAllow form={form} />
            <CategoryName number={2} text="모임에 대해 설명해주세요." />
            <Title form={form} />
            <Description form={form} />
            <div className="flex md:justify-end gap-2">
              <Button
                variant={'outline'}
                type="button"
                onClick={cancelClickHandler}
                className="flex-1 md:flex-none cursor-pointer"
              >
                취소하기
              </Button>
              <Button
                type="submit"
                className="flex-1 md:flex-none cursor-pointer"
              >
                등록하기
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
};
