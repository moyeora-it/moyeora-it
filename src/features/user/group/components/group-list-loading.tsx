import { GroupListItemLoading } from '@/features/user/group/components/group-list-item-loading';

export const GroupListLoading = () => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-7.5">
      <GroupListItemLoading />
    </ul>
  )
}