import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-[calc(100dvh-64px)] flex flex-col lg:flex-row lg:justify-center items-center py-8 gap-8">
        <div className="lg:w-[510px] flex flex-col items-center">
          <h2 className="text-[20px] font-extrabold">모여라! 이곳으로!</h2>
          <p className="text-[14px] text-center py-4">
            모여라it에서 실력과 팀원,
            <br />두 마리 토끼를 모두 잡으세요
          </p>
          <Image
            alt="logo"
            src="/logos/my-img.png"
            width={589}
            height={486}
            className="max-w-[200px] lg:max-w-[510px] w-full my-2"
          />
        </div>
        <div className="max-w-[510px] w-full bg-white space-y-8 rounded-[24px] py-8 px-10">
          {children}
        </div>
      </div>
    </>
  );
}
