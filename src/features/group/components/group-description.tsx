'use client';

import { GroupType, GroupTypeName } from '@/types';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeHTML = (markdown: string) => {
  const renderedHTML = DOMPurify.sanitize(markdown);
  return { __html: renderedHTML };
};

export const GroupDescription = ({
  description,
  groupType,
}: {
  description: string;
  groupType: GroupType;
}) => {
  return (
    <div className="flex flex-col gap-10 mt-15 mb-25">
      <h2 className="text-2xl font-bold pb-6 border-b-2 border-gray-100">
        {GroupTypeName[groupType]} 소개
      </h2>
      <div dangerouslySetInnerHTML={sanitizeHTML(description)} />
    </div>
  );
};
