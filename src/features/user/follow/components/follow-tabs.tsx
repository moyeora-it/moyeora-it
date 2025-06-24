'use client';

import { useParams, usePathname } from 'next/navigation';

import Link from 'next/link';

export const FollowTabs = () => {
  const { id } = useParams<{ id: string }>();

  const pathname = usePathname();

  const type = pathname.split('/').at(-1);

  return (
    <ul className="flex gap-3">
      {[
        {
          label: '팔로잉',
          value: 'followings',
          href: `/users/${id}/social/followings`,
        },
        {
          label: '팔로워',
          value: 'followers',
          href: `/users/${id}/social/followers`,
        },
      ].map(({ label, value, href }) => (
        <li className="relative" key={label}>
          <Link
            className={`font-semibold ${type === value ? 'text-gray-900' : 'text-gray-400'} transition-all`}
            href={href}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
