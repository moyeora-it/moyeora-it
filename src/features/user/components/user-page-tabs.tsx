'use client';

import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import Link from 'next/link';

const getIsActive = (pathname: string, href: string) => {
  if (pathname.includes('social') && href.includes('social')) {
    return true;
  }

  return pathname === href;
};

export const UserPageTabs = () => {
  const { id } = useParams<{ id: string }>();

  const pathname = usePathname();

  return (
    <ul className="flex gap-3 px-4 w-full overflow-x-auto scrollbar-hide">
      {[
        { label: '홈', href: `/users/${id}` },
        { label: '소셜', href: `/users/${id}/social/followings` },
        { label: '개설한 모임', href: `/users/${id}/groups/created` },
        { label: '종료된 모임', href: `/users/${id}/groups/ended` },
      ].map(({ label, href }) => {
        return (
          <li className="relative shrink-0" key={label}>
            <Link
              className={`text-lg font-semibold ${getIsActive(pathname, href) ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-gray-900' : 'text-gray-400'}`}
              href={href}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
