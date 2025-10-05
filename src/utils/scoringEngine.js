import { SCORING_WEIGHTS, ACTIVITY_TYPES } from '@/lib/constants';

/**
 * Calculate cost efficiency score (0-100)
 * Lower cost per day = higher score
 */
function calculateCostScore(itinerary, allItineraries) {
  const { total, perPerson } = itinerary.overview.cost;
  const { nights } = itinerary.overview.duration;

  if (!total || !nights) return 50;

  const costPerNight = total / nights;
  const costPerPersonPerNight = perPerson / nights;

  // Calculate average across all itineraries
  const allCosts = allItineraries.map(item => {
    const itemNights = item.overview.duration.nights || 1;
    return item.overview.cost.total / itemNights;
  });

  const avgCost = allCosts.reduce((sum, cost) => sum + cost, 0) / allCosts.length;
  const minCost = Math.min(...allCosts);
  const maxCost = Math.max(...allCosts);

  // Score inversely proportional to cost (lower cost = higher score)
  let score = 100;
  if (maxCost > minCost) {
    score = 100 - ((costPerNight - minCost) / (maxCost - minCost)) * 80;
  }

  // Bonus for below average cost
  if (costPerNight < avgCost) {
    score = Math.min(100, score + 10);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate activity diversity score (0-100)
 * More diverse activities = higher score
 */
function calculateActivityScore(itinerary) {
  const activities = itinerary.itinerary.flatMap(day =>
    day.activities.map(a => a.name || a.description || '')
  );

  if (activities.length === 0) return 30;

  const activityCounts = {
    beach: 0,
    cultural: 0,
    adventure: 0,
    leisure: 0,
  };

  // Categorize activities
  activities.forEach(activity => {
    const activityLower = activity.toLowerCase();

    Object.entries(ACTIVITY_TYPES).forEach(([type, keywords]) => {
      if (keywords.some(keyword => activityLower.includes(keyword))) {
        activityCounts[type.toLowerCase()]++;
      }
    });
  });

  // Calculate diversity (Shannon entropy)
  const totalActivities = activities.length;
  const typesWithActivities = Object.values(activityCounts).filter(count => count > 0).length;

  // Base score on number of unique types
  let score = (typesWithActivities / 4) * 60;

  // Bonus for total number of activities
  score += Math.min(30, activities.length * 3);

  // Penalty for imbalance (all activities of one type)
  const maxCount = Math.max(...Object.values(activityCounts));
  if (maxCount === totalActivities && totalActivities > 2) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate time optimization score (0-100)
 * Well-paced itinerary = higher score
 */
function calculateTimeScore(itinerary) {
  const { days } = itinerary.overview.duration;
  const dailyItinerary = itinerary.itinerary;

  if (!dailyItinerary || dailyItinerary.length === 0) return 40;

  const activitiesPerDay = dailyItinerary.map(day => day.activities.length);
  const avgActivitiesPerDay = activitiesPerDay.reduce((sum, count) => sum + count, 0) / activitiesPerDay.length;

  let score = 50;

  // Ideal range: 2-4 activities per day
  if (avgActivitiesPerDay >= 2 && avgActivitiesPerDay <= 4) {
    score += 30;
  } else if (avgActivitiesPerDay > 4) {
    score += 15; // Packed but might be rushed
  } else {
    score += 10; // Too relaxed or missing info
  }

  // Bonus for consistent pacing (low variance)
  const variance = activitiesPerDay.reduce((sum, count) =>
    sum + Math.pow(count - avgActivitiesPerDay, 2), 0
  ) / activitiesPerDay.length;

  if (variance < 1) {
    score += 20; // Very consistent
  } else if (variance < 2) {
    score += 10; // Reasonably consistent
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate inclusiveness score (0-100)
 * More inclusions, fewer exclusions = higher score
 */
function calculateInclusionsScore(itinerary) {
  const { inclusions, exclusions } = itinerary;

  let score = 50;

  // Base score on number of inclusions
  score += Math.min(30, inclusions.length * 3);

  // Penalty for many exclusions
  score -= Math.min(20, exclusions.length * 2);

  // Bonus for premium inclusions
  const premiumKeywords = ['luxury', 'premium', 'ac', 'air-conditioned', 'royal', 'deluxe', 'complimentary'];
  const premiumCount = inclusions.filter(item =>
    premiumKeywords.some(keyword => item.toLowerCase().includes(keyword))
  ).length;

  score += Math.min(20, premiumCount * 5);

  // Check for important inclusions
  const importantInclusions = ['meals', 'breakfast', 'accommodation', 'transport', 'ferry', 'sightseeing'];
  const importantCount = importantInclusions.filter(keyword =>
    inclusions.some(item => item.toLowerCase().includes(keyword))
  ).length;

  score += Math.min(15, importantCount * 3);

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate human-readable rationale
 */
function generateRationale(itinerary, scores, allItineraries) {
  const strengths = [];
  const improvements = [];
  const unique = [];

  // Cost analysis
  if (scores.costEfficiency > 70) {
    const costPerNight = itinerary.overview.cost.total / itinerary.overview.duration.nights;
    strengths.push(`Excellent value at ${Math.round(costPerNight)} per night`);
  } else if (scores.costEfficiency < 40) {
    improvements.push('Consider negotiating better pricing or look for package deals');
  }

  // Activity diversity
  if (scores.activityDiversity > 75) {
    strengths.push('Well-rounded mix of activities across different categories');
  } else if (scores.activityDiversity < 50) {
    improvements.push('Limited activity diversity - consider adding different experience types');
  }

  // Time optimization
  if (scores.timeOptimization > 70) {
    strengths.push('Well-paced itinerary with balanced daily activities');
  } else if (scores.timeOptimization < 50) {
    const avgActivities = itinerary.itinerary.reduce((sum, day) => sum + day.activities.length, 0) / itinerary.itinerary.length;
    if (avgActivities < 2) {
      improvements.push('Itinerary could include more activities per day');
    } else {
      improvements.push('Schedule might be too packed - consider more leisure time');
    }
  }

  // Inclusiveness
  if (scores.inclusiveness > 75) {
    strengths.push('Comprehensive package with many inclusions and few hidden costs');
  }

  // Premium features
  const premiumFeatures = [];
  if (itinerary.transport.ferry?.class === 'Premium') premiumFeatures.push('premium ferry');
  if (itinerary.inclusions.some(i => i.toLowerCase().includes('luxury'))) premiumFeatures.push('luxury accommodations');
  if (itinerary.inclusions.some(i => i.toLowerCase().includes('ac'))) premiumFeatures.push('AC transport');

  if (premiumFeatures.length > 0) {
    unique.push(`Includes ${premiumFeatures.join(', ')}`);
  }

  // Unique destinations
  if (itinerary.destinations.length > 3) {
    unique.push(`Covers ${itinerary.destinations.length} destinations`);
  }

  return {
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 2),
    unique: unique.slice(0, 2),
  };
}

/**
 * Main scoring function
 */
export function calculateScore(itinerary, allItineraries = []) {
  const comparisonSet = allItineraries.length > 0 ? allItineraries : [itinerary];

  const scores = {
    costEfficiency: calculateCostScore(itinerary, comparisonSet),
    activityDiversity: calculateActivityScore(itinerary),
    timeOptimization: calculateTimeScore(itinerary),
    inclusiveness: calculateInclusionsScore(itinerary),
  };

  // Calculate weighted total
  const total = Object.entries(scores).reduce((sum, [key, value]) => {
    return sum + (value * SCORING_WEIGHTS[key]);
  }, 0);

  const rationale = generateRationale(itinerary, scores, comparisonSet);

  return {
    total: Math.round(total),
    breakdown: scores,
    rationale,
  };
}
