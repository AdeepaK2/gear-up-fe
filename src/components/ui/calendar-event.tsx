import React from "react";

type Event = {
  date: Date;
  title: string;
  description?: string;
  color?: string;
};

type Props = {
  month: Date;
  events: Event[];
  onDayClick?: (date: Date) => void;
};

function getMonthMatrix(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  let dayIdx = firstDay.getDay();
  for (let i = 0; i < dayIdx; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, m, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

export function CalendarEvent({ month, events, onDayClick }: Props) {
  const matrix = getMonthMatrix(month);

  function getEventsForDay(date: Date) {
    return events.filter(e =>
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    );
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
      </div>
      <table className="w-full text-center">
        <thead>
          <tr className="text-gray-700 text-xs">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((week, i) => (
            <tr key={i}>
              {week.map((date, j) => (
                <td key={j} className="align-top h-20 w-1/7 relative">
                  {date ? (
                    <button
                      className="w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-200"
                      onClick={() => onDayClick?.(date)}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <span className="block w-full h-full"></span>
                  )}
                  {date &&
                    getEventsForDay(date).map((event, idx) => (
                      <div
                        key={idx}
                        className="mt-1 w-full rounded p-1 text-xs text-left"
                        style={{ background: event.color || "#e0e7ff" }}
                      >
                        <span className="font-semibold">{event.title}</span>
                        {event.description && (
                          <div className="text-xs">{event.description}</div>
                        )}
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
