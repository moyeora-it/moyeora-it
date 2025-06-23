import { FormLabel } from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleInfo } from '../circle-icon/circle-info';

type WriteFormLabelProps = {
  htmlFor?: string;
  text: string;
  className?: string;
  info?: string;
  isTooltipOpen?: boolean;
};

export const WriteFormLabel = ({
  htmlFor,
  text,
  className,
  info,
  isTooltipOpen,
}: WriteFormLabelProps) => {
  return (
    <div className="flex gap-1">
      <FormLabel
        htmlFor={htmlFor}
        className={`mb-1 text-base my-auto ${className}`}
      >
        {text}
      </FormLabel>
      {info && (
        <Tooltip open={isTooltipOpen}>
          <TooltipTrigger>
            <CircleInfo />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-400 fill-gray-400">
            <p>{info}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
