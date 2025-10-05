import { useState, useMemo, useEffect } from 'react';
import { UploadZone } from '@/components/upload/UploadZone';
import { ItineraryCard } from '@/components/itinerary/ItineraryCard';
import { ComparisonDashboard } from '@/components/comparison/ComparisonDashboard';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { Button } from '@/components/ui/Button';
import { useItineraryStore } from '@/hooks/useItineraries';
import { calculateScore } from '@/utils/scoringEngine';
import { Plane, BarChart3, Trash2, Printer } from 'lucide-react';

function App() {
  const { itineraries, removeItinerary, comparisonMode, setComparisonMode, clearAll } = useItineraryStore();
  const [scores, setScores] = useState({});
  const [filteredItineraries, setFilteredItineraries] = useState([]);

  const handlePrint = () => {
    window.print();
  };

  // Initialize filtered itineraries
  useEffect(() => {
    setFilteredItineraries(itineraries);
  }, [itineraries]);

  // Calculate scores when itineraries change
  useEffect(() => {
    if (filteredItineraries.length > 0) {
      const newScores = {};
      filteredItineraries.forEach(itinerary => {
        newScores[itinerary.id] = calculateScore(itinerary, filteredItineraries);
      });
      setScores(newScores);
    } else {
      setScores({});
    }
  }, [filteredItineraries]);

  const canCompare = filteredItineraries.length >= 2;
  const displayItineraries = filteredItineraries;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Itinerary Comparer</h1>
                <p className="text-sm text-slate-500">Compare travel packages intelligently</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                {itineraries.length}/{3} uploaded
              </div>
              {itineraries.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              )}
              {itineraries.length > 0 && (
                <Button
                  onClick={handlePrint}
                  variant="ghost"
                  size="sm"
                  className="gap-2 no-print"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              )}
              {canCompare && (
                <Button
                  onClick={() => setComparisonMode(!comparisonMode)}
                  variant={comparisonMode ? 'default' : 'outline'}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  {comparisonMode ? 'Hide Comparison' : 'Compare All'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upload Zone */}
        {itineraries.length < 3 && (
          <div className="mb-8 no-print">
            <UploadZone />
          </div>
        )}

        {/* Filter Panel */}
        {itineraries.length > 1 && (
          <div className="mb-6">
            <FilterPanel
              itineraries={itineraries}
              onFilter={setFilteredItineraries}
            />
          </div>
        )}

        {/* No Itineraries State */}
        {itineraries.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Plane className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Itineraries Yet
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Upload 2-3 PDF itineraries to start comparing. Our AI will analyze costs, activities,
              and value to help you choose the best package.
            </p>
          </div>
        )}

        {/* Comparison Dashboard */}
        {comparisonMode && canCompare && (
          <div className="mb-8">
            <ComparisonDashboard itineraries={displayItineraries} scores={scores} />
          </div>
        )}

        {/* Itinerary Cards Grid */}
        {displayItineraries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {comparisonMode ? 'Detailed View' : 'Your Itineraries'}
                {displayItineraries.length !== itineraries.length && (
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({displayItineraries.length} of {itineraries.length} shown)
                  </span>
                )}
              </h2>
              {itineraries.length === 1 && (
                <p className="text-sm text-slate-500">Upload at least 2 to compare</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItineraries.map((itinerary, index) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  index={index}
                  score={scores[itinerary.id]}
                  onRemove={() => removeItinerary(itinerary.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600">
          <p>Itinerary Comparer - Compare travel packages with intelligent scoring</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
