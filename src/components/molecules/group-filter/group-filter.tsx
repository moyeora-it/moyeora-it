'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/molecules/search-input/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';

/**
 * 모임 목록 필터 컴포넌트
 *
 * 사용자의 참가/모집 중인 모임 목록을 필터링한다.
 *
 * @returns 모임 목록 필터 컴포넌트
 */
export const GroupFilter = () => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const type = searchParams.get('type') ?? 'study';

  const order = searchParams.get('order') ?? 'latest';

  const handleOrderSelectChange = (value: string) => {
    const queryParams = new URLSearchParams(searchParams);
    if (queryParams.has('order') && queryParams.get('order') === value) {
      return;
    }
    queryParams.set('order', value);
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between">
        <ul className="flex gap-x-2 items-center">
          {[
            {
              label: '스터디',
              value: 'study',
            },
            {
              label: '프로젝트',
              value: 'project',
            },
          ].map((item) => (
            <li key={item.value}>
              <Link
                className={`shrink-0 ${type === item.value ? 'text-gray-900' : 'text-gray-400'} font-semibold`}
                href={`${pathname}?type=${item.value}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <SearchInput
          containerClassName="w-[150px] md:w-[200px]"
          placeholder="검색"
        />
      </div>
      <div className="flex">
        <Select
          defaultValue={order ?? 'latest'}
          onValueChange={handleOrderSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="최신순" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem defaultChecked value="latest">
                최신순
              </SelectItem>
              <SelectItem value="oldest">오래된 순</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
