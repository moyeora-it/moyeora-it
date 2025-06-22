import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupType } from '@/types';

export type TabType = {
  value: GroupType | ''; // 전체 선택은 ''로 표기하며, 타입 이름 없이 모든 그룹을 포함
  label: string;
};

export const Tab = ({
  tabList,
  children,
  onValueChange,
}: {
  tabList: TabType[];
  children: React.ReactNode;
  onValueChange: (value: GroupType) => void;
}) => {
  const handleValueChange = (value: string) => {
    onValueChange(value as GroupType);
  };

  return (
    <Tabs defaultValue={tabList[0].value} onValueChange={handleValueChange}>
      <TabsList className="py-3 md:py-5 -ml-2">
        {tabList.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-[20px] md:text-2xl font-extrabold cursor-pointer hover:text-gray-600"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabList.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};
