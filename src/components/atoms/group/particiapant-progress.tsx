'use client';

import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type GroupProgressProps = {
  participantsCount: number;
  maxParticipants: number;
  className?: string;
};

export const GroupProgress = ({
  participantsCount,
  maxParticipants,
  className,
}: GroupProgressProps) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setProgress((participantsCount / maxParticipants) * 100);
    });
  }, [maxParticipants, participantsCount]);

  return (
    <div className="mt-2">
      <div className="">
        <Image
          src={'/icons/person.svg'}
          width={20}
          height={20}
          alt="person icon"
          className="inline-block"
        />
        <span className="ml-1">{`${participantsCount}/${maxParticipants}`}</span>
      </div>
      <Progress value={progress} className={`mt-2 ${className}`} />
    </div>
  );
};
