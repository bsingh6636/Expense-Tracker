import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"



import { cn } from "../../utils/lib"
import { buttonVariants } from "./button"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-fit',
                month: 'space-y-4',
                month_caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-xs font-medium',
                nav: 'flex justify-between items-center',
                button_previous: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 absolute top-0 left-5 hover:opacity-100 pointer-events-auto z-10'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 absolute top-0 right-0 hover:opacity-100 pointer-events-auto z-10'
                ),
                month_grid: 'w-full border-collapse space-y-1',
                weekdays: 'flex',
                weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                week: 'flex mt-2',

                day: cn(
                    'relative p-0 text-center rounded-sm text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                    props.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                        : '[&:has([aria-selected])]:rounded-md'
                ),
                day_button: cn(
                    'h-8 w-8 p-0 font-normal cursor-pointer transition-colors',
                    'aria-selected:bg-primary aria-selected:rounded-md aria-selected:text-primary-foreground',
                    'aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground'
                ),
                selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                today: 'bg-accent text-accent-foreground',
                outside:
                    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                disabled: 'text-muted-foreground opacity-50',
                range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                hidden: 'invisible',
                day_range_start: 'day-range-start',
                day_range_end: 'day-range-end',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...props }) => {
                    if (orientation === 'left') {
                        return <ChevronLeftIcon className="h-4 w-4" {...props} />;
                    }
                    return <ChevronRightIcon className="h-4 w-4" {...props} />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar"

export { Calendar }