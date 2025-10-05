// Scoring weights (must sum to 1.0)
export const SCORING_WEIGHTS = {
  costEfficiency: 0.35,
  activityDiversity: 0.25,
  timeOptimization: 0.20,
  inclusiveness: 0.20,
};

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  maxFiles: 3,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: {
    'application/pdf': ['.pdf'],
  },
};

// Activity type categories
export const ACTIVITY_TYPES = {
  BEACH: ['beach', 'water', 'swimming', 'snorkeling', 'scuba', 'diving'],
  CULTURAL: ['temple', 'museum', 'heritage', 'historical', 'cultural', 'monument'],
  ADVENTURE: ['trek', 'hiking', 'adventure', 'kayak', 'rafting', 'climb'],
  LEISURE: ['spa', 'relax', 'cruise', 'sunset', 'shopping', 'sightseeing'],
};

// Itinerary card colors
export const CARD_COLORS = [
  { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
];

// Currency symbols mapping
export const CURRENCY_SYMBOLS = {
  '₹': 'INR',
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
};

// Meal plan types
export const MEAL_PLANS = {
  CP: 'Continental Plan (Breakfast only)',
  MAP: 'Modified American Plan (Breakfast + Dinner)',
  AP: 'American Plan (All meals)',
  EP: 'European Plan (No meals)',
};
