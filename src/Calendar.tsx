import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { addDays, miamiToday } from './booking';

export default function Calendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = miamiToday();
  const [month, setMonth] = useState(() =>
    new Date(`${value || today}T12:00:00Z`).toISOString().slice(0, 7),
  );
  const first = new Date(`${month}-01T12:00:00Z`);
  const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const shiftMonth = (offset: number) => {
    const date = new Date(first);
    date.setUTCMonth(date.getUTCMonth() + offset);
    setMonth(date.toISOString().slice(0, 7));
  };
  const monthLabel = first.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return (
    <div className="calendar">
      <div className="calendar-header">
        <strong aria-live="polite">{monthLabel}</strong>
        <div>
          <button
            type="button"
            className="icon-button"
            aria-label="Previous month"
            disabled={month <= today.slice(0, 7)}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next month"
            disabled={month >= addDays(today, 90).slice(0, 7)}
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="calendar-week" aria-hidden="true">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>
      <div className="calendar-days" role="group" aria-label={`Choose a date in ${monthLabel}`}>
        {Array.from({ length: first.getUTCDay() }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, '0')}`;
          return (
            <button
              type="button"
              key={date}
              aria-label={new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              })}
              aria-pressed={date === value}
              disabled={date < today || date > addDays(today, 90)}
              className={date === value ? 'selected' : ''}
              onClick={() => onChange(date)}
            >
              {i + 1}
              {date === today && <span className="today-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
