import React from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface DateTimePickerProps {
    scheduledDate: string;
    onDateChange: (val: string) => void;
    scheduledTime: string;
    onTimeChange: (val: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    scheduledDate,
    onDateChange,
    scheduledTime,
    onTimeChange,
}) => {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Date
                </label>
                <div className="relative">
                    <CalendarIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                    <input
                        type="date"
                        required
                        className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors"
                        value={scheduledDate}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Time
                </label>
                <div className="relative">
                    <ClockIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                    <input
                        type="time"
                        required
                        className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors"
                        value={scheduledTime}
                        onChange={(e) => onTimeChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateTimePicker;
