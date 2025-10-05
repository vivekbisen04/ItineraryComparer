import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { SlidersHorizontal, X } from 'lucide-react';

export function FilterPanel({ itineraries, onFilter }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 100000,
    minDuration: 0,
    maxDuration: 30,
    destinations: [],
  });

  // Extract unique destinations
  const allDestinations = [
    ...new Set(itineraries.flatMap((itin) => itin.destinations)),
  ];

  // Get budget range from itineraries
  const budgets = itineraries.map((i) => i.overview.cost.total);
  const minBudgetValue = Math.min(...budgets, 0);
  const maxBudgetValue = Math.max(...budgets, 100000);

  const applyFilters = () => {
    const filtered = itineraries.filter((itin) => {
      const cost = itin.overview.cost.total;
      const nights = itin.overview.duration.nights;

      // Budget filter
      if (cost < filters.minBudget || cost > filters.maxBudget) return false;

      // Duration filter
      if (nights < filters.minDuration || nights > filters.maxDuration) return false;

      // Destination filter
      if (filters.destinations.length > 0) {
        const hasDestination = filters.destinations.some((dest) =>
          itin.destinations.includes(dest)
        );
        if (!hasDestination) return false;
      }

      return true;
    });

    onFilter(filtered);
  };

  const resetFilters = () => {
    setFilters({
      minBudget: 0,
      maxBudget: 100000,
      minDuration: 0,
      maxDuration: 30,
      destinations: [],
    });
    onFilter(itineraries);
  };

  const toggleDestination = (dest) => {
    setFilters((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter((d) => d !== dest)
        : [...prev.destinations, dest],
    }));
  };

  if (!showFilters) {
    return (
      <Button
        onClick={() => setShowFilters(true)}
        variant="outline"
        size="sm"
        className="gap-2 no-print"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </Button>
    );
  }

  return (
    <Card className="mb-6 no-print">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Budget Range
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={minBudgetValue}
                max={maxBudgetValue}
                value={filters.minBudget}
                onChange={(e) =>
                  setFilters({ ...filters, minBudget: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>₹{filters.minBudget.toLocaleString()}</span>
                <span>to</span>
                <span>₹{filters.maxBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={minBudgetValue}
                max={maxBudgetValue}
                value={filters.maxBudget}
                onChange={(e) =>
                  setFilters({ ...filters, maxBudget: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Duration (Nights)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={30}
                value={filters.minDuration}
                onChange={(e) =>
                  setFilters({ ...filters, minDuration: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{filters.minDuration} nights</span>
                <span>to</span>
                <span>{filters.maxDuration} nights</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={filters.maxDuration}
                onChange={(e) =>
                  setFilters({ ...filters, maxDuration: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Destinations Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Destinations
            </label>
            <div className="flex flex-wrap gap-2">
              {allDestinations.map((dest) => (
                <Badge
                  key={dest}
                  variant={
                    filters.destinations.includes(dest) ? 'default' : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => toggleDestination(dest)}
                >
                  {dest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button onClick={applyFilters} size="sm">
            Apply Filters
          </Button>
          <Button onClick={resetFilters} variant="outline" size="sm">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
