'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { InputTextField } from '@/components/molecules/input-text-field';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { request } from '@/api/request';

const formSchema = z.object({
  email: z.string().nonempty({ message: '이메일을 입력해주세요' }).email({
    message: '유효한 이메일이 아닙니다.',
  }),
});

const FindEmailForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const [disabled, setDisabled] = useState(false);

  // find-email인 경우
  const [isExisted, setIsExisted] = useState(false);
  const [isNotExisted, setIsNotExisted] = useState(false);

  // 이메일 찾기
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setDisabled(true);

      // find-email인 경우
      // 중복이면 false, 중복이 아니면 true
      const {
        status: { success },
      } = await request.post(
        '/v1/user/check-email',
        {
          'Content-Type': 'application/json',
        },
        JSON.stringify(values),
      );

      if (success) {
        setIsExisted(false);
        setIsNotExisted(true);
      } else {
        setIsExisted(true);
        setIsNotExisted(false);
      }
    } catch (e) {
      // 중복으로 처리하ㅔ셔서 에러나면 존재하는거임
      // TODO: 이메일 찾기 실패시 에러코드 맞춰서 설정해주기
      setIsExisted(true);
      setIsNotExisted(false);
      console.log(e);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InputTextField
          form={form}
          name="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
        />

        {/* 성공시 로그인페이지로 갈지 비밀번호 찾기로 갈지 물어보기 */}
        {isExisted && (
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-blue-900 text-center">
              해당 이메일이 존재합니다!
            </p>
            <Link href="/login">로그인하러 가기</Link>
            <Link href="/find-password">비밀번호 찾기</Link>
          </div>
        )}

        {isNotExisted && (
          <p className="text-red-600 text-center">
            해당 이메일이 존재하지 않습니다
          </p>
        )}
        <Button className="w-full bg-gray-400" disabled={disabled}>
          이메일 찾기
        </Button>
      </form>
    </Form>
  );
};

export default FindEmailForm;
