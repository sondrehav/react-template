import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';

import CalendarIcon from '@/components/icons/Table.svg';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const DatePicker = ({
  initialDate,
  onChange,
}: {
  initialDate?: string;
  onChange?: (date?: string) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={'full'}
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !initialDate && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className={'mr-2 h-4 w-4'} />
          {initialDate ? format(initialDate, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={
          'w-auto p-0 relative z-50 bg-white border border-primary-200 dark:border-primary-800'
        }
      >
        <Calendar
          mode={'single'}
          selected={initialDate ? new Date(initialDate) : undefined}
          onSelect={(d) => onChange?.(d?.toISOString())}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
