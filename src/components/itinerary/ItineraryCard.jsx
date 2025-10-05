import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, DollarSign, Users, MapPin, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { CARD_COLORS } from '@/lib/constants';
import { DayTimeline } from './DayTimeline';

export function ItineraryCard({ itinerary, index, onRemove, score }) {
  const [expanded, setExpanded] = useState(false);
  const colors = CARD_COLORS[index % CARD_COLORS.length];

  const { name, overview, destinations, itinerary: dailyItinerary, inclusions, exclusions } = itinerary;

  return (
    <Card className={`border-l-4 ${colors.border} hover:shadow-lg transition-shadow`}>
      <CardHeader className={`${colors.bg}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {formatDuration(overview.duration.nights, overview.duration.days)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(overview.cost.total, overview.cost.currency)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="w-3 h-3" />
                {overview.participants.adults} Adults
              </Badge>
              {destinations.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {destinations.length} Destinations
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {score && (
              <div className="text-center">
                <div className={`text-3xl font-bold ${colors.text}`}>
                  {score.total}
                </div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Key Highlights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">Per Person</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(overview.cost.perPerson, overview.cost.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Per Night</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(
                Math.round(overview.cost.total / overview.duration.nights),
                overview.cost.currency
              )}
            </p>
          </div>
        </div>

        {/* Destinations */}
        {destinations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest, idx) => (
                <Badge key={idx} variant="secondary">
                  {dest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Score Breakdown */}
        {score && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Cost Efficiency</span>
                <span className="font-semibold">{score.breakdown.costEfficiency}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Activities</span>
                <span className="font-semibold">{score.breakdown.activityDiversity}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time Optimization</span>
                <span className="font-semibold">{score.breakdown.timeOptimization}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Inclusiveness</span>
                <span className="font-semibold">{score.breakdown.inclusiveness}/100</span>
              </div>
            </div>

            {/* Rationale */}
            {score.rationale && (
              <div className="mt-4 space-y-2">
                {score.rationale.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-green-700">Strengths</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      {score.rationale.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {score.rationale.improvements.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Improvements</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      {score.rationale.improvements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Expandable Details */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between"
        >
          <span className="font-semibold">
            {expanded ? 'Hide Details' : 'Show Daily Itinerary & Details'}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {expanded && (
          <div className="mt-6 space-y-6">
            {/* Daily Itinerary */}
            {dailyItinerary.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Daily Itinerary</h4>
                <DayTimeline days={dailyItinerary} />
              </div>
            )}

            {/* Inclusions */}
            {inclusions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Inclusions</h4>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                  {inclusions.slice(0, 8).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusions */}
            {exclusions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Exclusions</h4>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                  {exclusions.slice(0, 5).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
