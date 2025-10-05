import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CARD_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export function ComparisonDashboard({ itineraries, scores }) {
  // Prepare cost comparison data
  const costData = useMemo(() => {
    return itineraries.map((itinerary, index) => ({
      name: itinerary.name.substring(0, 20),
      total: itinerary.overview.cost.total,
      perNight: Math.round(itinerary.overview.cost.total / itinerary.overview.duration.nights),
      perPerson: itinerary.overview.cost.perPerson,
      color: CARD_COLORS[index % CARD_COLORS.length].border.replace('border-', ''),
    }));
  }, [itineraries]);

  // Prepare activity diversity data
  const activityData = useMemo(() => {
    const allActivities = itineraries.flatMap(itinerary =>
      itinerary.itinerary.flatMap(day => day.activities)
    );

    const categories = {
      Beach: 0,
      Cultural: 0,
      Adventure: 0,
      Leisure: 0,
      Other: 0,
    };

    allActivities.forEach(activity => {
      const activityText = (activity.name || activity.description || '').toLowerCase();

      if (/beach|water|swim|snorkel|dive/.test(activityText)) {
        categories.Beach++;
      } else if (/temple|museum|heritage|historic|culture/.test(activityText)) {
        categories.Cultural++;
      } else if (/trek|hike|adventure|kayak|raft/.test(activityText)) {
        categories.Adventure++;
      } else if (/spa|relax|cruise|sunset|shop|sightseeing/.test(activityText)) {
        categories.Leisure++;
      } else {
        categories.Other++;
      }
    });

    return Object.entries(categories)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [itineraries]);

  // Prepare score comparison data
  const scoreData = useMemo(() => {
    return itineraries.map((itinerary, index) => {
      const score = scores[itinerary.id];
      return {
        name: itinerary.name.substring(0, 20),
        score: score?.total || 0,
        costScore: score?.breakdown.costEfficiency || 0,
        activityScore: score?.breakdown.activityDiversity || 0,
        timeScore: score?.breakdown.timeOptimization || 0,
        inclusionScore: score?.breakdown.inclusiveness || 0,
      };
    });
  }, [itineraries, scores]);

  const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3B82F6" name="Total Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="total" fill="#3B82F6" name="Total Cost" radius={[8, 8, 0, 0]} />
              <Bar dataKey="perPerson" fill="#10B981" name="Per Person" radius={[8, 8, 0, 0]} />
              <Bar dataKey="perNight" fill="#F59E0B" name="Per Night" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Diversity */}
      {activityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="costScore" fill="#3B82F6" name="Cost Efficiency" />
              <Bar dataKey="activityScore" fill="#10B981" name="Activity Diversity" />
              <Bar dataKey="timeScore" fill="#F59E0B" name="Time Optimization" />
              <Bar dataKey="inclusionScore" fill="#8B5CF6" name="Inclusiveness" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  {itineraries.map((itinerary, index) => (
                    <th key={index} className="text-left p-3 font-semibold">
                      {itinerary.name.substring(0, 25)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 text-slate-600">Duration</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.overview.duration.nights}N / {itinerary.overview.duration.days}D
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">Destinations</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.destinations.length}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">Activities</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.itinerary.reduce((sum, day) => sum + day.activities.length, 0)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">Inclusions</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.inclusions.length}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">AC Transport</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.transport?.vehicle?.ac ? '✓' : '✗'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">Ferry</td>
                  {itineraries.map((itinerary, index) => (
                    <td key={index} className="p-3">
                      {itinerary.transport?.ferry ? itinerary.transport.ferry.class : '✗'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
