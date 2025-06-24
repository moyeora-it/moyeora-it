'use client';

import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { GroupSort, Order } from '@/types';
import {
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useSearchParams } from 'next/navigation';

type OrderProps = {
  updateQueryParams: (queries: Record<string, string>) => void;
};

export const SortOrder = ({ updateQueryParams }: OrderProps) => {
  const searchParams = useSearchParams();
  const selectedSort = searchParams.get('sort');
  const selectedOrder = searchParams.get('order');

  const orderOptions: {
    name: string;
    value: { sort: GroupSort; order: Order };
  }[] = [
    { name: '작성일자 ▼', value: { sort: 'createdAt', order: 'desc' } },
    { name: '작성일자 ▲', value: { sort: 'createdAt', order: 'asc' } },
    { name: '마감일자 ▼', value: { sort: 'deadline', order: 'desc' } },
    { name: '마감일자 ▲', value: { sort: 'deadline', order: 'asc' } },
  ];

  const getSelectedOrderOptionName = () => {
    const found = orderOptions.find(
      (option) =>
        option.value.sort === selectedSort &&
        option.value.order === selectedOrder,
    );

    if (!selectedSort && !selectedOrder) {
      // 초기값은 sort, order가 모두 없으므로 기본값 반환
      return '작성일자 ▼';
    }

    return found?.name;
  };

  const orderSelectHandler = (option: { sort: GroupSort; order: Order }) => {
    if (selectedSort === option.sort && selectedOrder === option.order) {
      // 이미 선택된 정렬 옵션과 현재 선택한 정렬 옵션이 같을 경우 아무 동작하지 않음
      return;
    }

    // 이미 선택된 sort나 order가 현재 선택한 sort나 order와 같을 경우 updateQueryParams에서 제외하여 토글되지 않게 한다
    if (selectedSort === option.sort) {
      if (option.order === 'desc') {
        updateQueryParams({ order: option.order, cursor: 'null' });
        return;
      }
      updateQueryParams({ order: option.order });
      return;
    }
    if (selectedOrder === option.order) {
      if (option.order === 'desc') {
        updateQueryParams({ sort: option.sort, cursor: 'null' });
        return;
      }
      updateQueryParams({ sort: option.sort });
      return;
    }

    if (option.order === 'desc') {
      updateQueryParams({
        sort: option.sort,
        order: option.order,
        cursor: 'null',
      });
      return;
    }
    // 이미 선택된 정렬 옵션과 아예 다른 경우 updateQueryParams에서 모두 업데이트 한다
    updateQueryParams({ sort: option.sort, order: option.order });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className=" ml-auto cursor-pointer">
          {getSelectedOrderOptionName()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 px-4 py-2 text-sm text-primary font-medium bg-white  rounded-[12px] border border-gray-200 z-10">
        {orderOptions.map((option) => (
          <PopoverClose
            key={option.name}
            onClick={() => orderSelectHandler(option.value)}
            className="p-1 cursor-pointer"
          >
            {option.name}
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
};
