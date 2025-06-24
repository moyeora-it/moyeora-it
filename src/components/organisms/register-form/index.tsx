'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputTextField } from '@/components/molecules/input-text-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { request } from '@/api/request';
import addBookmarkWhenAuth from '@/features/auth/utils/addBookmarkWhenAuth';

// 회원가입에 쓰이는 이메일과 비밀번호 유효성
const registerFormSchema = z
  .object({
    email: z.string().nonempty({ message: '이메일을 입력해주세요' }).email({
      message: '유효한 이메일이 아닙니다',
    }),
    password: z
      .string()
      .nonempty({ message: '비밀번호를 입력해주세요' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: '영어, 숫자, 특수문자를 혼합하여 8자리 이상',
      }),
    passwordConfirm: z.string().nonempty({
      message: '비밀번호를 다시 입력해주세요',
    }),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password && passwordConfirm && password !== passwordConfirm) {
      ctx.addIssue({
        path: ['passwordConfirm'],
        message: '비밀번호가 일치하지 않습니다',
        code: z.ZodIssueCode.custom,
      });
    }
  });

const RegisterForm = () => {
  const [isRegisterFailed, setIsRegisterFailed] = useState(false);

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const [disabled, setDisabled] = useState(false);

  const fetchAndSetUser = useAuthStore((s) => s.fetchAndSetUser);

  // 회원가입
  const onRegisterSubmit = async (
    values: z.infer<typeof registerFormSchema>,
  ) => {
    try {
      setDisabled(true);
      // 회원가입 로직 작성 /user/signup
      // 에러처리 별도로 해줘야 할 수도 있음
      const {
        status: { success: registerSuccess },
      } = await request.post(
        '/v1/user/signup',
        {
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      );

      if (!registerSuccess) throw new Error('회원가입 실패');

      const {
        status: { success: loginSuccess },
      } = await request.post(
        '/v1/user/login',
        {
          'Content-Type': 'application/json',
        },
        JSON.stringify(values),
        {
          credentials: 'include',
        },
      );

      if (!loginSuccess) throw new Error('로그인 실패');

      // 로그인 성공 후 북마크 정보 불러오기
      const bookmarkListStr = localStorage.getItem('bookmarkList');

      // 북마크 정보가 있다면 서버에 저장
      if (bookmarkListStr !== null) {
        await addBookmarkWhenAuth(bookmarkListStr);
      }

      // 로그인 성공 후 회원정보 불러오기 /me
      await fetchAndSetUser();
    } catch (e) {
      setIsRegisterFailed(true);
      console.log(e);
      setDisabled(false);
    }
  };

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
        className="space-y-8"
        role="register-form"
      >
        <InputTextField
          form={registerForm}
          name="email"
          placeholder="이메일"
          type="email"
          label="이메일"
        />

        <InputTextField
          form={registerForm}
          name="password"
          placeholder="비밀번호"
          type="password"
          label="비밀번호"
        />

        <InputTextField
          form={registerForm}
          name="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          type="password"
        />

        {isRegisterFailed && (
          <p className="text-red-600">이미 존재하는 회원입니다</p>
        )}
        <Button className="w-full bg-gray-400" disabled={disabled}>
          회원가입
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
