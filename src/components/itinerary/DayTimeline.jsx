import { useState } from 'react';
import { MapPin, Utensils, Hotel, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export function DayTimeline({ days }) {
  const [expandedDays, setExpandedDays] = useState(
    // Expand first 2 days by default
    days.reduce((acc, day, index) => {
      acc[day.day] = index < 2;
      return acc;
    }, {})
  );

  const toggleDay = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {days.map((day, index) => {
          const isExpanded = expandedDays[day.day];

          return (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 flex items-center justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shadow-lg ring-4 ring-white">
                  {day.day}
                </div>
              </div>

              {/* Day content */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Day header - Clickable */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full bg-gradient-to-r from-primary/5 to-transparent px-4 py-3 border-b border-slate-200 hover:from-primary/10 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Day {day.day}
                      </h5>
                      {day.title && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{day.title}</p>
                      )}
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>

              {/* Activities list - Collapsible */}
              {isExpanded && day.activities.length > 0 && (
                <div className="p-4">
                  <div className="space-y-2">
                    {day.activities.map((activity, actIdx) => (
                      <div
                        key={actIdx}
                        className="flex items-start gap-3 p-2.5 rounded-md hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {activity.name || activity.description}
                          </p>
                          {activity.time && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{activity.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer - Meals and Accommodation - Always visible */}
              {(day.meals.length > 0 || day.accommodation) && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                  <div className="flex flex-wrap gap-2">
                    {day.meals.length > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                        {day.meals.join(' • ')}
                      </div>
                    )}

                    {day.accommodation && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        <Hotel className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[200px]">{day.accommodation.hotel}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
