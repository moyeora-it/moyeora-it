import { Position } from '@/types/enums';
import { PositionBadge } from '../../molecules/position-badge';

type GroupPositionsProps = {
  positions: Position[];
  className?: string;
};

export const GroupPositions = ({
  positions,
  className,
}: GroupPositionsProps) => {
  return (
    <ul className="flex gap-2 w-full overflow-y-scroll scrollbar-hide">
      {positions.map((position, i) => (
        <li key={i} className={className}>
          <PositionBadge name={Position[position]} />
        </li>
      ))}
    </ul>
  );
};
